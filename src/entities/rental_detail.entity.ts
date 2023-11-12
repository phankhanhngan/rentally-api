import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Base } from './base.entity';

@Entity({ tableName: 'rental_details' })
export class RentalDetail extends Base {
  @Property({ nullable: true })
  moveInDate: Date;

  @Property({ nullable: true })
  moveOutDate: Date;

  @Property({ nullable: true })
  leaseTerm: number;

  @Property({ nullable: true, type: 'decimal' })
  monthlyRent: number;

  @Property({ nullable: true, type: 'decimal' })
  leaseTerminationCost: number;

  @Property({ nullable: true })
  renterIdentifyNo: string;

  @Property({ nullable: true })
  landlordIdentifyNo: string;

  @Property({ nullable: true })
  renterIdentifyDate: Date;

  @Property({ nullable: true })
  landlordIdentifyDate: Date;

  @Property({ nullable: true })
  renterIdentifyAddress: string;

  @Property({ nullable: true })
  landlordIdentifyAddress: string;

  @Property({ nullable: true })
  renterBirthday: Date;

  @Property({ nullable: true })
  landlordBirthday: Date;

  @Property({ nullable: true, type: 'decimal' })
  electricPrice: number;

  @Property({ nullable: true, type: 'decimal' })
  waterPrice: number;

  @Property({ nullable: true, type: 'decimal' })
  addtionalPrice: number;
}
