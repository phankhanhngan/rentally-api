import { faker } from '@faker-js/faker';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Utility } from '../../entities/utility.entity';

export class UtilitySeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const utilities = [];
    Array.from(Array(40).keys()).forEach(async () => {
      utilities.push({
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 10 }),
        updated_id: faker.number.int({ min: 0, max: 10 }),
        name: faker.animal.bear(),
        note: faker.lorem.sentence(),
      })
    });
    em.insertMany(Utility, utilities);
  }

}
