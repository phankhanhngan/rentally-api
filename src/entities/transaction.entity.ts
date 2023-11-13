import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/core';
import { Base } from './base.entity';
import { TransactionStatus } from '../common/enum/common.enum';
import { Payment } from './payment.entity';

@Entity({ tableName: 'transactions' })
export class Transaction extends Base {
  @ManyToOne({
    entity: () => Payment,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  payment!: Payment;
  @Property({ nullable: false })
  @Enum({ items: () => TransactionStatus })
  status: TransactionStatus;
}
