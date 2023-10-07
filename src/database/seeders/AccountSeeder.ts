import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { User } from '../../entities/user.entity';
import { Role, UserStatus } from '../../common/enum/common.enum';
import * as bcrypt from 'bcrypt';

export class AccountSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = [];
    const password = await bcrypt.hash('123456', 10);
    Array.from(Array(50).keys()).forEach(async () => {
      users.push({
        // id: faker.number.int({ min: 0, max: 100 }),
        googleId: faker.string.uuid(),
        email: faker.internet.email(),
        password: password,
        firstName: faker.animal.bear(),
        lastName: faker.animal.bear(),
        photo: faker.image.avatar(),
        phoneNumber: faker.phone.number(),
        role: this.randomEnumValue(Role),
        verificationCode: faker.string.uuid(),
        timeStamp: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 10 }),
        updated_id: faker.number.int({ min: 0, max: 10 }),
        status: UserStatus.ACTIVE,
      });
    });
    em.insertMany(User, users);
  }
  randomEnumValue = (enumeration) => {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
  };
}
