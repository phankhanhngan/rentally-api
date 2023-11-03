import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { RoomRating } from 'src/entities/room-rating.entity';

export class RatingSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const rating = [];
    Array.from(Array(40).keys()).forEach(async () => {
        rating.push({
        
      });
    });
    em.insertMany(RoomRating, rating);
  }
//   randomEnumValue = (enumeration) => {
//     const values = Object.keys(enumeration);
//     const enumKey = values[Math.floor(Math.random() * values.length)];
//     return enumeration[enumKey];
//   };
}
