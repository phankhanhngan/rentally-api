import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Base } from './base.entity';
import { RoomBlock } from './room-block.entity';

@Entity({ tableName: 'rooms' })
export class Room extends Base {
  @ManyToOne({
    entity: () => RoomBlock,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  roomblock: RoomBlock;

  @Property({ nullable: false })
  roomName!: string;

  @Property({ nullable: false, type: 'decimal' })
  area!: number;

  @Property({ nullable: false })
  price!: bigint;

  @Property({ nullable: false })
  depositAmount!: bigint;

  @Property({ nullable: false, type: 'text' })
  images: string;

  @Property({ nullable: true, type: 'text' })
  utilities: string;

  @Property({ nullable: true, type: 'text' })
  status: string;
}
