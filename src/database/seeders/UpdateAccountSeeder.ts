import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { vietnamePhone } from './jsData/vietnamePhone';
import { account } from './jsData/stripeConnectedAccount';
import { User } from '../../entities';
import { Role } from '../../common/enum/common.enum';

export class UpdateAccountSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = await em.find<User>(User, { role: Role.MOD }, { limit: 12 });
    const phoneNumbers = vietnamePhone;
    const stripeAccount = account;
    users.map((el, i) => {
      // el.phoneNumber = phoneNumbers[i].number;
      el.bankCode = '01101100';
      el.accountNumber = '000123456789';
      el.stripeAccountId = account[i].account;
      el.stripeBankAccountId = account[i].bank;
    });
    await em.persistAndFlush(users);
  }
}
