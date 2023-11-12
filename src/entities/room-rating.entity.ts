import { Entity, ManyToOne, Property, OneToOne } from '@mikro-orm/core';
import { Base } from './base.entity';
import { Room } from './room.entity';
import { User } from './user.entity';
import { Rental } from './rental.entity';

@Entity({ tableName: 'room_ratings' })
export class RoomRating extends Base {
  @ManyToOne({
    entity: () => Room,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  room!: Room;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  renter!: User;

  @OneToOne({
    entity: () => Rental,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  rental!: Rental;

  @Property({ nullable: true, type: 'text' })
  comment: string;

  @Property({ nullable: false, type: 'int' })
  cleanRate: number;

  @Property({ nullable: false, type: 'int' })
  supportRate: number;

  @Property({ nullable: false, type: 'int' })
  locationRate: number;

  @Property({ nullable: false, type: 'int' })
  securityRate: number;
}
