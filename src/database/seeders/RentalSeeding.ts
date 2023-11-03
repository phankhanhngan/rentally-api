import type { EntityManager } from '@mikro-orm/core';
import { Seeder, faker } from '@mikro-orm/seeder';
import { Rental } from 'src/entities/rental.entity';
import { RentalDetail } from 'src/entities/rental_detail.entity';

export class RentalSeeding extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const rentals = [];
    const leaseTerm = [3,6,9,12]
    Array.from(Array(10).keys()).forEach(async () => {
      const rentalDetail = {
            moveInDate: new Date(),
            moveOutDate: new Date("2023-12-30"),
            leaseTerm: this.randomArr(leaseTerm),
            monthlyRent: 2000000,
            leaseTerminationCost: 500000,
            renterIdentifyNo: `192${Math.floor(100 + Math.random() * 900)}${Math.floor(100 + Math.random() * 900)}`,
            landlordIdentifyNo: `192${Math.floor(100 + Math.random() * 900)}${Math.floor(100 + Math.random() * 900)}`,
            renterIdentifyDate: faker.date.birthdate,
            landlordIdentifyDate: faker.date.birthdate,
            renterIdentifyAddress: faker.address.streetAddress,
            landlordIdentifyAddress: faker.address.streetAddress,
            renterBirthday: faker.date.birthdate,
            landlordBirthday: faker.date.birthdate,
            electricPrice: 3500,
            waterPrice: 6000,
            addtionalPrice: 0,
            created_at: new Date(),
            updated_at: new Date(),
            created_id: 1,
            updated_id: 1,
      };
      em.insert(RentalDetail, rentalDetail);
      rentals.push({});
    });
    em.insertMany(Rental, rentals);
  }
  randomArr(arr: any){
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
