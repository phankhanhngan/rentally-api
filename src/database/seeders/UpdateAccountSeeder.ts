import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { vietnamePhone } from './jsData/vietnamePhone';
import { User } from '../../entities';

export class UpdateAccountSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = await em.find<User>(User, {});
    const phoneNumbers = vietnamePhone;
    users.map((el, i) => {
      el.phoneNumber = phoneNumbers[i].number;
    });
    await em.persistAndFlush(users);
  }
}
