import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RoomBlock } from './room-block.entity';
import { RoomStatus } from '../common/enum/common.enum';
import { BaseUUID } from './baseUUID.enity';

@Entity({ tableName: 'rooms' })
export class Room extends BaseUUID {

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
