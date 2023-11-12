import { Entity, ManyToOne, PrimaryKey, Property, Enum } from '@mikro-orm/core';
import { Base } from './base.entity';
import { Rental } from './rental.entity';
import { PaymentStatus } from '../../src/common/enum/common.enum';

@Entity({ tableName: 'payments' })
export class Payment extends Base {
  @ManyToOne({
    entity: () => Rental,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  rental!: Rental;

  @Property({ nullable: false, type: 'decimal' })
  totalPrice!: number;

  @Property({ nullable: false })
  electricNumber!: number;

  @Property({ nullable: false, type: 'decimal' })
  totalElectricPrice!: number;

  @Property({ nullable: false })
  waterNumber!: number;

  @Property({ nullable: false, type: 'decimal' })
  totalWaterPrice!: number;

  @Property({ nullable: false, type: 'decimal' })
  additionalPrice = 0;

  @Property({ nullable: false })
  month: number;

  @Property({ nullable: false })
  year: number;

  @Property({ nullable: true })
  paidAt: Date;

  @Property({ nullable: false })
  @Enum({ items: () => PaymentStatus })
  status: PaymentStatus;
}
