import { EntityManager } from '@mikro-orm/mysql';
import { Seeder } from '@mikro-orm/seeder';
import {
  PaymentStatus,
  RentalStatus,
  Role,
  RoomStatus,
  UserStatus,
} from '../../common/enum/common.enum';
import { Room, User } from '../../entities';
import { faker } from '@faker-js/faker';
import { RentalDetail } from '../../entities/rental_detail.entity';
import { Rental } from '../../entities/rental.entity';
import { RoomRating } from '../../entities/room-rating.entity';
import moment from 'moment';
import { Payment } from '../../entities/payment.entity';

export class SeedDataSeeder extends Seeder {
  leaseTerm = [12, 12];
  years = [2020, 2021, 2022, 2023];
  async run(em: EntityManager): Promise<void> {
    const rooms = await em.find(
      Room,
      { status: RoomStatus.EMPTY },
      { populate: ['roomblock', 'roomblock.landlord'] },
    );
    for await (const room of rooms) {
      this.years.forEach(async (el) => {
        const user = await this.randomRenter(em);

        const rentalDetail = this.createRentalDetail(el, room);
        await em.insert(RentalDetail, rentalDetail);
        const rental = {
          landlord: room.roomblock.landlord,
          renter: user,
          room: room,
          rentalDetail: rentalDetail,
          tenants: 1,
          status: RentalStatus.ENDED,
          created_at: new Date(),
          updated_at: new Date(),
          created_id: 1,
          updated_id: 1,
        };
        await em.insert(Rental, rental);
        const rating = await em.insert(RoomRating, {
          room: room,
          renter: user,
          rental: rental,
          comment: faker.lorem.paragraph(),
          cleanRate: Math.floor(Math.random() * 5) + 1,
          supportRate: Math.floor(Math.random() * 5) + 1,
          locationRate: Math.floor(Math.random() * 5) + 1,
          securityRate: Math.floor(Math.random() * 5) + 1,
          created_at: new Date(),
          updated_at: new Date(),
          created_id: 1,
          updated_id: 1,
        });
        let payments = [];
        Array.from({ length: 10 }, (_, i) => i + 1).forEach(async (month) => {
          const nextMonthDt = moment(rentalDetail.moveInDate).add(month, 'M');
          const eleNum = Math.floor(Math.random() * (150 - 80 + 1)) + 80;
          const waterNum = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
          const elePrice = eleNum * rentalDetail.electricPrice;
          const waterPrice = waterNum * rentalDetail.waterPrice;
          const addPrice = 0;
          payments.push({
            rental: rental,
            electricNumber: eleNum,
            waterNumber: waterNum,
            totalElectricPrice: elePrice,
            totalWaterPrice: waterPrice,
            totalPrice:
              Number(rental.rentalDetail.monthlyRent) +
              Number(elePrice) +
              Number(waterPrice) +
              Number(addPrice),
            additionalPrice: addPrice,
            month: nextMonthDt.month() + 1,
            year: nextMonthDt.year(),
            paidAt: nextMonthDt.endOf('month').toDate(),
            status: PaymentStatus.PAID,
            created_at: new Date(),
            updated_at: new Date(),
            created_id: 1,
            updated_id: 1,
          });
        });
        await em.insertMany(Payment, payments);
      });
    }
  }
  async randomRenter(em: EntityManager) {
    const users = await em.find(User, {
      role: Role.USER,
      status: UserStatus.ACTIVE,
    });
    return users[Math.floor(Math.random() * users.length)];
  }
  createRentalDetail(year: number, room: Room) {
    return {
      moveInDate: new Date(year.toString() + '-01-01'),
      moveOutDate: new Date(year.toString() + '-12-31'),
      leaseTerm: this.randomArr(this.leaseTerm),
      monthlyRent: parseInt(room.price.toString()),
      leaseTerminationCost: 500000,
      renterIdentifyNo: `192${Math.floor(
        100 + Math.random() * 900,
      )}${Math.floor(100 + Math.random() * 900)}`,
      landlordIdentifyNo: `192${Math.floor(
        100 + Math.random() * 900,
      )}${Math.floor(100 + Math.random() * 900)}`,
      renterIdentifyDate: faker.date.birthdate(),
      landlordIdentifyDate: faker.date.birthdate(),
      renterIdentifyAddress: faker.address.streetAddress(),
      landlordIdentifyAddress: faker.address.streetAddress(),
      renterBirthday: faker.date.birthdate(),
      landlordBirthday: faker.date.birthdate(),
      electricPrice: 3500,
      waterPrice: 6000,
      addtionalPrice: 0,
      created_at: new Date(),
      updated_at: new Date(),
      created_id: 1,
      updated_id: 1,
    };
  }
  randomArr(arr: any) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
