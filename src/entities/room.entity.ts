import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { RoomBlock } from './room-block.entity';
import { RoomStatus } from '../common/enum/common.enum';

@Entity({ tableName: 'rooms' })
export class Room {
  @PrimaryKey()
  @Property({ type: 'uuid', nullable: false })
  id: string;

  @Property({ nullable: false })
  created_at: Date = new Date();

  @Property({ nullable: false })
  updated_at: Date = new Date();

  @Property({ nullable: false })
  created_id: number;

  @Property({ nullable: false })
  updated_id: number;

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
  status: RoomStatus;
}
