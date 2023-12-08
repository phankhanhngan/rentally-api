import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { PaymentStatus } from 'src/common/enum/common.enum';

@Injectable()
export class StatisticService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async getTotalMonthlyAmountByYearMod(year: number, landlordId: number) {
    try {
      const qb = this.em.getKnex().raw(
        `select sum(p.total_price) as totalMonthlyAmountByYear, p.month as month from payments p
        inner join rental r 
        on p.rental_id = r.id
        where r.landlord_id = :landlordId and p.year = :year and p.status = :status
        group by p.month
        order by p.month`,
        { year: year, landlordId: landlordId, status: PaymentStatus.PAID },
      );

      const res = await this.em.execute(qb);

      const statisticDto = {
        year: year,
        months: [],
        totalMoney: 0
      };
      let totalMoney = 0;
      statisticDto.months = Array.from({ length: 12 }, () => 0);
      for(let i=0; i<res.length; i++) {     
        totalMoney += Number(res[i].totalMonthlyAmountByYear)
        statisticDto.months[Number(res[i].month)] = Number(res[i].totalMonthlyAmountByYear);
      }      
      statisticDto.totalMoney = totalMoney;

      return statisticDto;
    } catch (error) {
      throw error;
    }
  }

  async getTotalMonthlyAmountByYearUser(year: number, renterId: number) {
    try {
      const qb = this.em.getKnex().raw(
        `select sum(p.total_price) as totalPrice, sum(p.total_electric_price) as electric, sum(p.total_water_price) as water, sum(p.additional_price) as additionalPrice, p.month
        from payments p
        inner join rental r
        on p.rental_id = r.id
        where r.renter_id = :renterId and p.year = :year
        group by p.month
        order by p.month`,
        { year: year, renterId: renterId, status: PaymentStatus.PAID },
      );

      const statisticDto = {
        year: year,
        months: [],
        totalMoney: 0,
      }
      statisticDto.months = Array.from({ length: 12 }, (_, index) => {
        return {
          totalPrice: 0,
          electric: 0,
          water: 0,
          additionalPrice: 0,
          month: index + 1
        };
      });
      const res = await this.em.execute(qb);
      for(let i=0; i<res.length; i++) {        
        statisticDto.totalMoney += Number(res[i].totalPrice);
        statisticDto.months[Number(res[i].month)-1] = res[i];
      }
      return statisticDto;
    } catch (error) {
      throw error;
    }
  }

  async getPriceDetailByMonth(year: number, month: number, renterId) {
    try {
      const qb = this.em.getKnex().raw(
        `select sum(p.total_price) as totalPrice, sum(p.total_electric_price) as electric, sum(p.total_water_price) as water, sum(p.additional_price) as additionalPrice, p.month
        from payments p
        inner join rental r
        on p.rental_id = r.id
        where r.renter_id = :renterId and p.year = :year and p.month = :month
        group by p.month
        order by p.month`,
        { year: year, month: month, renterId: renterId, status: PaymentStatus.PAID },
      );

      const res = await this.em.execute(qb);
      let totalMoney = 0;
      for(let i=0; i<res.length; i++) {
        totalMoney += Number(res[i].totalPrice)
      }
      if(res.length === 0) {
        return {
          totalPrice: 0,
          electric: 0,
          water: 0,
          additionalPrice: 0
        }
      }
      return {
        year: year,
        ...res[0],
      };
    } catch (error) {
      throw error;
    }
  }

}
