import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { User } from '../../entities/user.entity';
import { Role } from '../../common/enum/common.enum';
import { Point, RoomBlock } from '../../entities/room-block.entity';

export class RoomBlockSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roomBlocks = await Promise.all(
      Array.from(Array(30).keys()).map(async () => {
        const landlord = await this.randomLandLord(em);
        return {
          addressLine1: faker.location.streetAddress(),
          addressLine2: faker.location.secondaryAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          coordinate: new Point(
            faker.location.latitude(),
            faker.location.longitude(),
          ),
          description: faker.lorem.sentence(),
          landlord: landlord,
          created_at: new Date(),
          updated_at: new Date(),
          created_id: landlord.id,
          updated_id: landlord.id,
        };
      }),
    );

    em.persistAndFlush(
      roomBlocks.map((roomBlockData) => em.create(RoomBlock, roomBlockData)),
    );
  }

  async randomLandLord(em: EntityManager) {
    const users = await em.find(User, { role: Role.MOD });
    return users[Math.floor(Math.random() * users.length)];
  }
}
