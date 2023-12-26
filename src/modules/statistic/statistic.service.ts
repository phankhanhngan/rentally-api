import { EntityManager } from '@mikro-orm/mysql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaymentStatus, Role } from 'src/common/enum/common.enum';
import { ViewRoomDTO } from '../mod/rooms/dto/view-room.dto';
import { RoomBlock, User } from 'src/entities';
import { UtilitiesService } from '../utilities/utilities.service';
import { RoomBlocksService } from '../admin/roomblocks/roomblocks.service';

@Injectable()
export class StatisticService {
  constructor(
    private readonly em: EntityManager,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  // MOD
  async getRevenueMonthlyByYear(year: number, landlordId: number) {
    try {
      const qb = this.em.getKnex().raw(
        `select sum(p.total_price) as revenue, sum(p.total_electric_price) as electric,
        sum(p.total_water_price) as water, sum(p.additional_price) as additionalPrice, p.month as month 
        from payments p
        inner join rental r 
        on p.rental_id = r.id
        where r.landlord_id = :landlordId and p.year = :year and p.status = :status
        group by p.month
        order by p.month`,
        { year: year, landlordId: landlordId, status: PaymentStatus.PAID },
      );

      const statisticDto = {
        statistics: [],
        totalRevenue: 0,
      };
      statisticDto.statistics = Array.from({ length: 12 }, (_, index) => {
        return {
          revenue: 0,
          electric: 0,
          water: 0,
          additionalPrice: 0,
          month: index + 1,
        };
      });

      const res = await this.em.execute(qb);
      for (let i = 0; i < res.length; i++) {
        statisticDto.totalRevenue += Number(res[i].revenue);
        for (const key in res[i]) {
          res[i][key] = Number(res[i][key]);
        }

        statisticDto.statistics[Number(res[i].month) - 1] = res[i];
      }
      return statisticDto;
    } catch (error) {
      throw error;
    }
  }

  async getTRentalsMonthlyByYear(year: number, user: User) {
    try {
      const qb = this.em.getKnex().raw(
        `select month(created_at) as month, count(id) as rentals from rental
        where year(created_at) = :year ${
          user.role !== Role.ADMIN ? 'and landlord_id = :landlordId' : ''
        }
        group by month 
        order by month`,
        { year: year, landlordId: user.id },
      );

      const statisticDto = {
        statistics: [],
        totalRental: 0,
      };
      statisticDto.statistics = Array.from({ length: 12 }, (_, index) => {
        return {
          month: index + 1,
          rentals: 0,
        };
      });

      const res = await this.em.execute(qb);
      for (let i = 0; i < res.length; i++) {
        statisticDto.totalRental += Number(res[i].rentals);
        statisticDto.statistics[Number(res[i].month) - 1] = res[i];
      }
      return statisticDto;
    } catch (error) {
      throw error;
    }
  }

  async getStatisticRoom(user: User, id: number) {
    try {
      const query = { id };
      if (user.role === Role.MOD) {
        query['landlord'] = { id: user.id };
      }
      console.log(query);

      const roomblock = await this.em.findOne(RoomBlock, query);
      if (!roomblock) {
        throw new BadRequestException(
          `Can not find room block with id=[${id}]`,
        );
      }
      const qb = this.em.getKnex().raw(
        `select count(r.status) as rooms, r.status from rooms r
        inner join roomblocks rb
        on r.roomblock_id = rb.id
        where r.deleted_at is null
        and rb.id = :id
        ${user.role !== Role.ADMIN ? 'and rb.landlord_id = :landlordId' : ''}
        group by r.status`,
        { landlordId: user.id, id: id },
      );
      const res = await this.em.execute(qb);
      const statisticDto = {
        empty: 0,
        occupied: 0,
      };
      for (let i = 0; i < res.length; i++) {
        statisticDto[res[i].status.toLowerCase()] = res[i].rooms;
      }
      return statisticDto;
    } catch (error) {
      throw error;
    }
  }

  async getTop5(user: User, order: string) {
    try {
      const qb = this.em.getKnex().raw(
        `select r.id, r.room_name, r.area, r.price, r.deposit_amount, r.images, r.utilities, r.status,
        round(avg((clean_rate + support_rate + location_rate + security_rate) / 4), 2) as ratings 
        from room_ratings rr
        inner join rooms r
        on rr.room_id = r.id
        inner join roomblocks rb
        on r.roomblock_id = rb.id
        ${user.role !== Role.ADMIN ? 'where rb.landlord_id = :landlordId' : ''}
        and r.deleted_at is null
        group by room_id 
        order by avg((clean_rate + support_rate + location_rate + security_rate) / 4) ${order}
        limit 5`,
        { landlordId: user.id },
      );
      const res = await this.em.execute(qb);
      const rooms = [];
      for (let i = 0; i < res.length; i++) {
        const { ratings, ...room } = res[i];
        const roomDto = plainToInstance(ViewRoomDTO, room);
        const { utilities } = roomDto;
        const utilitiesDto = [];
        for (let i = 0; i < utilities.length; i++) {
          const utilityDto = await this.utilitiesService.getUtilityById(
            Number(utilities[i]),
          );
          utilitiesDto.push(utilityDto);
        }
        roomDto.utilities = utilitiesDto;
        rooms.push({ ...roomDto, ratings: Number(ratings) });
      }
      return rooms;
    } catch (error) {
      throw error;
    }
  }

  async getTopRooms(user: User) {
    try {
      const roomsGood = await this.getTop5(user, 'desc');
      const roomsBad = await this.getTop5(user, 'asc');
      return {
        good: roomsGood,
        bad: roomsBad,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOverview(user: User) {
    try {
      const qb = this.em.getKnex().raw(
        `SELECT rooms, roomblocks, rentals, ratings FROM (
          SELECT COUNT(r.id) AS rooms FROM rooms r
          INNER JOIN roomblocks rb ON r.roomblock_id = rb.id
          WHERE r.deleted_at IS NULL ${
            user.role !== Role.ADMIN ? 'and rb.landlord_id = :landlordId' : ''
          }
      ) AS count_rooms
      CROSS JOIN (
          SELECT COUNT(id) AS roomblocks FROM roomblocks
          WHERE deleted_at IS NULL ${
            user.role !== Role.ADMIN ? 'and landlord_id = :landlordId' : ''
          }
      ) AS count_blocks
      CROSS JOIN (
          SELECT COUNT(id) AS rentals FROM rental
          WHERE (status = 'COMPLETED' or status = 'ENDED') ${
            user.role !== Role.ADMIN ? 'and landlord_id = :landlordId' : ''
          }
      ) AS count_rental
      CROSS JOIN (
          SELECT COUNT(rr.id) AS ratings FROM room_ratings rr
        INNER JOIN rooms r
        ON rr.room_id = r.id
        INNER JOIN roomblocks rb
        ON r.roomblock_id = rb.id
        ${user.role !== Role.ADMIN ? 'WHERE rb.landlord_id = :landlordId' : ''}
      ) AS count_ratings;
      `,
        { landlordId: user.id },
      );
      const total = {
        rooms: 0,
        roomblocks: 0,
        rentals: 0,
        ratings: 0,
      };
      const res = await this.em.execute(qb);
      if (res.length === 0) return total;
      for (const key in res[0]) {
        total[key] = res[0][key];
      }
      return total;
    } catch (error) {
      throw error;
    }
  }

  // MOD, ADMIN

  // USER
  async getCostMonthlyByYear(year: number, renterId: number) {
    try {
      const qb = this.em.getKnex().raw(
        `select sum(p.total_price) as cost, sum(p.total_electric_price) as electric, sum(p.total_water_price) as water, sum(p.additional_price) as additionalPrice, p.month
        from payments p
        inner join rental r
        on p.rental_id = r.id
        where r.renter_id = :renterId and p.year = :year
        group by p.month
        order by p.month`,
        { year: year, renterId: renterId, status: PaymentStatus.PAID },
      );

      const statisticDto = {
        statistics: [],
        totalCost: 0,
      };
      statisticDto.statistics = Array.from({ length: 12 }, (_, index) => {
        return {
          cost: 0,
          electric: 0,
          water: 0,
          additionalPrice: 0,
          month: index + 1,
          increase: 0,
        };
      });
      const res = await this.em.execute(qb);
      for (let i = 0; i < res.length; i++) {
        statisticDto.totalCost += Number(res[i].cost);
        for (const key in res[i]) {
          res[i][key] = Number(res[i][key]);
        }
        statisticDto.statistics[Number(res[i].month) - 1] = {
          ...res[i],
          increase: 0,
        };
      }

      for (let i = 1; i < 12; i++) {
        if (statisticDto.statistics[i - 1].cost === 0) {
          statisticDto.statistics[i].increase =
            statisticDto.statistics[i].cost === 0 ? 0 : 100;
        } else {
          statisticDto.statistics[i].increase = parseFloat(
            (
              ((statisticDto.statistics[i].cost -
                statisticDto.statistics[i - 1].cost) /
                statisticDto.statistics[i - 1].cost) *
              100
            ).toFixed(2),
          );
        }
      }

      return statisticDto;
    } catch (error) {
      throw error;
    }
  }

  // USER

  // ADMIN
  async getNewUserMonthlyByYearAdmin(year: number) {
    try {
      const qb = this.em.getKnex().raw(
        `select month(created_at) as month, count(id) as users
        from users
        where year(created_at) = :year
        group by month 
        order by month`,
        { year: year },
      );

      const statisticDto = {
        statistics: [],
        totalUsers: 0,
      };
      statisticDto.statistics = Array.from({ length: 12 }, (_, index) => {
        return {
          month: index + 1,
          users: 0,
        };
      });

      const res = await this.em.execute(qb);
      for (let i = 0; i < res.length; i++) {
        statisticDto.totalUsers += Number(res[i].users);
        statisticDto.statistics[Number(res[i].month) - 1] = res[i];
      }
      return statisticDto;
    } catch (error) {
      throw error;
    }
  }
}
