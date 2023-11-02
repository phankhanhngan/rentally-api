import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Room } from './room.entity';
import { RentalDetail } from './rental_detail.entity';

@Entity({ tableName: 'rental' })
export class Rental extends Base {
  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  landlord!: User;

  @OneToOne({
    entity: () => User,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  renter!: User;

  @OneToOne({
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

  
}
