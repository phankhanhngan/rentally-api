import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseUUID {
  @PrimaryKey()
  @Property({ nullable: false })
  id: string;

  @Property({ nullable: false })
  created_at: Date = new Date();

  @Property({ nullable: false })
  updated_at: Date = new Date();

  @Property({ nullable: false })
  created_id: number;

  @Property({ nullable: false })
  updated_id: number;
}
