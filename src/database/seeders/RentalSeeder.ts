import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Rental } from '../../entities/rental.entity';
import { RentalDetail } from '../../entities/rental_detail.entity';
import { RentalStatus, Role, RoomStatus } from '../../common/enum/common.enum';
import { Room, User } from '../../entities';
import { faker } from '@faker-js/faker';

export class RentalSeeder extends Seeder {
  leaseTerm = [3, 6, 9, 12];
  async run(em: EntityManager): Promise<void> {
    const rentals = [];
    for (let i = 0; i < 10; i++) {
      const rentalDetail = await em.insert(
        RentalDetail,
        this.createRentalDetail(),
      );
      const landlord = await this.randomLandLord(em);
      const renter = await this.randomRenter(em);
      const room = await this.randomRoom(em);
      rentals.push({
        landlord: landlord,
        renter: renter,
        room: room,
        rentalDetail: rentalDetail,
        tenants: 1,
        status: RentalStatus.COMPLETED,
        created_at: new Date(),
        updated_at: new Date(),
        created_id: 1,
        updated_id: 1,
      });
    }
    await em.insertMany(Rental, rentals);
  }
  randomArr(arr: any) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  createRentalDetail() {
    return {
      moveInDate: new Date(),
      moveOutDate: new Date('2023-12-30'),
      leaseTerm: this.randomArr(this.leaseTerm),
      monthlyRent: faker.number.int({ min: 0, max: 100 }),
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
  async randomLandLord(em: EntityManager) {
    const users = await em.find(User, { role: Role.MOD });
    return users[Math.floor(Math.random() * users.length)];
  }
  async randomRenter(em: EntityManager) {
    const users = await em.find(User, { role: Role.USER });
    return users[Math.floor(Math.random() * users.length)];
  }
  async randomRoom(em: EntityManager) {
    const rooms = await em.find(Room, { status: RoomStatus.EMPTY });
    return rooms[Math.floor(Math.random() * rooms.length)];
  }
}
