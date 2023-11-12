import { Check, type EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Checklist } from '../../entities/checklist.entity';
import { Room, User } from '../../entities';
import { Role, RoomStatus } from '../../common/enum/common.enum';

export class CheckListSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const checklist = [];
    for (let i = 0; i < 50; i++) {
      const room = await this.randomRoom(em);
      const renter = await this.randomRenter(em);
      checklist.push({
        room: room,
        renter: renter,
        created_at: new Date(),
        updated_at: new Date(),
        created_id: 1,
        updated_id: 1,
      });
    }
    await em.insertMany(Checklist, checklist);
  }
  async randomRenter(em: EntityManager) {
    const users = await em.find(User, { role: Role.USER });
    return users[Math.floor(Math.random() * users.length)];
  }
  async randomRoom(em: EntityManager) {
    const rooms = await em.find(Room, { status: RoomStatus.EMPTY });
    return rooms[Math.floor(Math.random() * rooms.length)];
  }
}
