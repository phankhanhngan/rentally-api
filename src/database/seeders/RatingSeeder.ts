import type { EntityManager } from '@mikro-orm/core';
import { Seeder, faker } from '@mikro-orm/seeder';
import { RoomRating } from '../../entities/room-rating.entity';
import { Rental } from '../../entities/rental.entity';
import { RentalStatus } from '../../common/enum/common.enum';
import { Room } from '../../entities/room.entity';
import { User } from '../../entities/user.entity';

export class RatingSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const rating = [];
    const rentals = await em.find(Rental, { status: RentalStatus.COMPLETED }, { limit: 5 , populate: ['renter','landlord','room']});
    for (let i = 0; i < 5; i++) {
      const room = await em.findOne(Room, { id: rentals[i].room.id });
      const renter = await em.findOne(User, { id: rentals[i].renter.id })
      rating.push({
        room: room,
        renter: renter,
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
    }
    await em.insertMany(RoomRating, rating);
  }
}
