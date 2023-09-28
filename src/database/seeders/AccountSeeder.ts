import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Role, User } from '../../entities/user.entity';

export class AccountSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users: Array<User> = [];
    Array.from(Array(10).keys()).forEach(() => {
      users.push({
        id: faker.number.int({ min: 0, max: 100 }),
        googleId: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.animal.bear(),
        lastName: faker.animal.bear(),
        photo: faker.image.avatar(),
        isEnable: true,
        phoneNumber: faker.phone.number(),
        role: Role.USER,
        verificationCode: null,
        timeStamp: null,
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 100 }),
        updated_id: faker.number.int({ min: 0, max: 100 }),
        isRegister: false,
      });
    });
    em.insertMany(User, users);
  }
}
