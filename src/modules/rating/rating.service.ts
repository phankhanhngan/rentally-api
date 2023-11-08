import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RatingDTO } from './dto/rating.dto';
import { EntityManager } from '@mikro-orm/mysql';
import { RentalService } from '../rental/rental.service';
import { RentalStatus } from 'src/common/enum/common.enum';
import { RoomRating } from 'src/entities/room-rating.entity';
import { Rental } from '../../entities/rental.entity';
import { RoomsService } from '../admin/rooms/rooms.service';
import { Room } from 'src/entities';
import { log } from 'console';

@Injectable()
export class RatingService {
  constructor(
    private readonly em: EntityManager,
    private readonly rentalService: RentalService,
    private readonly roomsService: RoomsService,
  ) {}
  async createRating(idLogin: any, ratingDto: RatingDTO) {
    try {
      const rental = await this.rentalService.findByIdAndRenter(
        ratingDto.rentalId,
        idLogin,
        RentalStatus.COMPLETED,
      );
      if (!rental) {
        throw new BadRequestException('You are not rent this rental!');
      }
      const ratingDb = await this.findByRenterAndRoomAndRental(
        rental.room.id,
        rental.renter.id,
        rental.id,
      );
      if (ratingDb) {
        throw new BadRequestException('You are already rated this room');
      }
      const rating = new RoomRating();
      rating.comment = ratingDto.comment;
      rating.rental = rental;
      rating.room = rental.room;
      rating.renter = rental.renter;
      rating.cleanRate = ratingDto.cleanRate;
      rating.locationRate = ratingDto.locationRate;
      rating.securityRate = ratingDto.securityRate;
      rating.supportRate = ratingDto.supportRate;
      rating.created_id = idLogin;
      rating.updated_id = idLogin;
      rating.created_at = new Date();
      rating.updated_at = new Date();
      await this.em.persistAndFlush(rating);
      return rating;
    } catch (error) {
      throw error;
    }
  }
  async findByRenterAndRoomAndRental(
    roomId: string,
    renterId: number,
    rentalId: number,
  ) {
    const queryObj = {
      $and: [
        {
          renter: {
            $and: [{ id: renterId }],
          },
        },
        {
          room: {
            $and: [{ id: roomId }],
          },
        },
        {
          rental: {
            $and: [{ id: rentalId }],
          },
        },
      ],
    };
    const rating = await this.em.findOne(RoomRating, queryObj, {
      populate: ['renter', 'room', 'rental'],
    });
    return rating;
  }
  async findByRoom(roomId: string) {
    const queryObj = {
      room: {
        id: roomId,
      },
    };
    try {
      // const room = await this.roomsService.findRoomById(roomId);
      const qb = this.em.getKnex().raw(
        `SELECT rt.id, rt.created_at as createdAt,
         rt.comment as comment, rt.clean_rate as cleanRate,
         rt.location_rate as locationRate,
         rt.security_rate as securityRate,
         rt.support_rate as supportRate,
         (rt.clean_rate + rt.location_rate + rt.security_rate + rt.support_rate) / 4 as avgRate,  
         concat(u.first_name, ' ', u.last_name) as renterName,
         u.photo as renterPhoto
         FROM rentally.room_ratings rt  
        inner join users u on u.id  = rt.renter_id
        where rt.room_id = :id`,
        { id: roomId },
      );
      const res = await this.em.execute(qb);
      if (res.length < 1) {
        return {
          ratings: null,
          avgRate: 0
        };
      }
      const totalRating = res.length;
      let avgRate = 0,
        avgClean = 0,
        avgLocation = 0,
        avgSecurity = 0,
        avgSupport = 0;
      for (let index = 0; index < res.length; index++) {
        avgRate += parseFloat(res[index].avgRate);
        avgClean += res[index].cleanRate;
        avgLocation += res[index].locationRate;
        avgSecurity += res[index].securityRate;
        avgSupport += res[index].supportRate;
      }
      const data = {
        ratings: res,
        avgRate: parseFloat((avgRate / totalRating).toFixed(1)),
        avgClean: avgClean / totalRating,
        avgLocation: avgLocation / totalRating,
        avgSecurity: avgSecurity / totalRating,
        avgSupport: avgSupport / totalRating,
        totalRating: totalRating,
      };
      return data;
      // return listRating;
    } catch (error) {
      throw error;
    }
  }
}
