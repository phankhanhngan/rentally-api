import { Entity, Property } from '@mikro-orm/core';
import { Base } from './base.entity';

@Entity({ tableName: 'utilities' })
export class Utility extends Base {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: true })
  note?: string;
}
