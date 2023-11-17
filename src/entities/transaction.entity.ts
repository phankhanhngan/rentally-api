import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/core';
import { Base } from './base.entity';
import { TransactionStatus } from 'src/common/enum/common.enum';
import { Payment } from './payment.entity';

@Entity({ tableName: 'transactions' })
export class Transaction extends Base {
  @Property({ nullable: true })
  paymentId: number;

  @Property({ nullable: true })
  rentalId: number;

  @Property({ nullable: false })
  @Enum({ items: () => TransactionStatus })
  status: TransactionStatus;

  @Property({ nullable: true })
  description: string;

  @Property({ nullable: true, length: 255 })
  stripeId: string;
}
