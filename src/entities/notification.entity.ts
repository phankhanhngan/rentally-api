import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'notifications' })
export class Notification {
  @PrimaryKey()
  @Property({ nullable: false })
  id: number;
  
  @Property({ nullable: false })
  paymentId: number;

  @Property({ nullable: false })
  created_at: Date = new Date();
  @Property({ nullable: false })
  renterId!: number;
  @Property({ type: 'text', nullable: false })
  message!: string;
}
