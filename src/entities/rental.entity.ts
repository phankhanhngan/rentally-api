import { Entity, ManyToOne, OneToOne, Property, Enum } from '@mikro-orm/core';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Room } from './room.entity';
import { RentalDetail } from './rental_detail.entity';
import { RentalStatus } from '../common/enum/common.enum';

@Entity({ tableName: 'rental' })
export class Rental extends Base {
  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  landlord!: User;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  renter!: User;

  @ManyToOne({
    entity: () => Room,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  room!: Room;

  @OneToOne({
    entity: () => RentalDetail,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  rentalDetail!: RentalDetail;

  @Property({ nullable: false })
  @Enum({ items: () => RentalStatus })
  status: RentalStatus;

  @Property({ nullable: false })
  attendance: number;
}
