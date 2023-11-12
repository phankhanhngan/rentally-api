import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'provinces' })
@Index({ properties: ['code'] })
export class Province {
  @PrimaryKey()
  @Property({ nullable: false })
  code: string;
  @Property({ nullable: false })
  name: string;
  @Property({ nullable: false })
  name_en: string;
  @Property({ nullable: false })
  full_name: string;
  @Property({ nullable: false })
  full_name_en: string;
  @Property({ nullable: false })
  code_name: string;
  @Property({ nullable: false })
  administrative_unit_id: number;
  @Property({ nullable: false })
  administrative_region_id: number;
}
