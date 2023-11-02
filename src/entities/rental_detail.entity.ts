import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Base } from './base.entity';

@Entity({ tableName: 'rental_details' })
export class RentalDetail extends Base {
  @Property({ nullable: false })
  moveInDate: Date;

  @Property({ nullable: false })
  moveOutDate: Date;

  @Property({ nullable: false })
  leaseTerm: number;

  @Property({ nullable: false, type: 'decimal' })
  monthlyRent: number;

  @Property({ nullable: true, type: 'decimal' })
  leaseTerminationCost: number;

  @Property({ nullable: false })
  renterIdentifyNo: string;

  @Property({ nullable: false })
  landlordIdentifyNo: string;

  @Property({ nullable: true })
  renterIdentifyDate: Date;

  @Property({ nullable: true })
  landlordIdentifyDate: Date;

  @Property({ nullable: true })
  renterIdentifyAddress: string;

  @Property({ nullable: true })
  landlordIdentifyAddress: string;

  @Property({ nullable: false })
  renterBirthday: Date;

  @Property({ nullable: false })
  landlordBirthday: Date;

  @Property({ nullable: false, type: 'decimal' })
  electricPrice: number;

  @Property({ nullable: false, type: 'decimal' })
  waterPrice: number;

  @Property({ nullable: false, type: 'decimal' })
  addtionalPrice: number;
}
