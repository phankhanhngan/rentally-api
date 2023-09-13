import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class Base {
  @PrimaryKey()
  @Property({ nullable: false })
  id: number;

  @Property({ nullable: false })
  created_at: Date = new Date();

  @Property({ nullable: false })
  updated_at: Date = new Date();
}
