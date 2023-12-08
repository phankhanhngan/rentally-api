import type { EntityManager } from '@mikro-orm/core';
import { Seeder, faker } from '@mikro-orm/seeder';
import { TransactionStatus } from '../../../src/common/enum/common.enum';
import { Transaction } from '../../../src/entities/transaction.entity';
export class TransactionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const transactions = [];
    Array.from(Array(60).keys()).forEach(async () => {
      const t = {
        payment_id: faker.datatype.number(),
        rental_id: faker.datatype.number(),
        status: this.randomEnumValue(TransactionStatus),
        stripeId: faker.datatype.string(),
        description: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.datatype.number(),
        updated_id: faker.datatype.number(),
      };
      transactions.push(t);
    });
    em.insertMany(Transaction, transactions);
  }
  randomEnumValue = (enumeration) => {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
  };
}
