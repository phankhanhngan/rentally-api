import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Utility } from '../../entities/utility.entity';
import {utilities} from '../../database/seeders/jsData/utilities';
export class UtilitySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.insertMany(Utility, utilities);
  }
}
