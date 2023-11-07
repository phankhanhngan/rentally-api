import { Entity, ManyToOne } from '@mikro-orm/core';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity({ tableName: 'checklist' })
export class Checklist extends Base {
  @ManyToOne({
    entity: () => Room,
  })
  room!: Room;

  @ManyToOne({
    entity: () => User,
  })
  renter!: User;
}
