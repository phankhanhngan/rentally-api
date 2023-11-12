import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'districts' })
@Index({ properties: ['code'] })

export class District {
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
  province_code: string;
  @Property({ nullable: false })
  administrative_unit_id: number;
}
