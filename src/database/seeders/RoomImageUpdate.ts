import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Room } from '../../entities';
import { roomImageUrls } from './jsData/roomImages';

export class RoomImageUpdate extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const rooms = await em.find<Room>(Room, {});
    const images = roomImageUrls;
    let startIndex = 0;

    rooms.map((el, i) => {
      el.images = JSON.stringify(images.slice(startIndex, startIndex + 5));
      startIndex += 5;
    });
    await em.persistAndFlush(rooms);
  }
}
