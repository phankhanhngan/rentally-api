import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Point, Room, RoomBlock, User } from '../../entities';
import { v4 as uuidv4 } from 'uuid';
import { Role, RoomStatus } from '../../common/enum/common.enum';

export class RoomSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roomBlocks = await em.find<RoomBlock>(RoomBlock, {});
    const rooms = [];
    Array.from(Array(50).keys()).forEach(async () => {
      rooms.push({
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        created_id: faker.number.int({ min: 0, max: 10 }),
        updated_id: faker.number.int({ min: 0, max: 10 }),
        roomName: faker.animal.bear(),
        area: faker.number.int({ min: 0, max: 100 }),
        price: faker.number.int({ min: 0, max: 100 }),
        depositAmount: faker.number.int({ min: 0, max: 100 }),
        images: JSON.stringify([faker.image.urlPicsumPhotos(), faker.image.urlPicsumPhotos(), faker.image.urlPicsumPhotos()]),
        utilities: JSON.stringify([1]),
        status: RoomStatus.EMPTY,
        roomblock: roomBlocks[Math.floor(Math.random() * roomBlocks.length)],
      });
    });
    em.insertMany(Room, rooms);
  }

  async randomLandLord(em: EntityManager) {
    const users = await em.find(User, { role: Role.MOD });
    return users[Math.floor(Math.random() * users.length)];
  }
}
