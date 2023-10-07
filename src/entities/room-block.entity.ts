import { Entity, Type, Property, ManyToOne } from '@mikro-orm/core';
import { Base } from './base.entity';
import { User } from './user.entity';

export class Point {
  constructor(public latitude: number, public longitude: number) {}
}

export class PointType extends Type<Point | undefined, string | undefined> {
  convertToJSValueSQL(key: string) {
    return `ST_AsText(${key})`;
  }

  convertToDatabaseValueSQL(key: string) {
    return `ST_PointFromText(${key})`;
  }

  getColumnType(): string {
    return 'point';
  }
}

@Entity({ tableName: 'roomblocks' })
export class RoomBlock extends Base {
  @Property({ type: 'text', nullable: false })
  address!: string;

  @Property({ type: 'text', nullable: true })
  coordinate?: Point;

  @Property({ type: 'text', nullable: false })
  description!: string;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    onUpdateIntegrity: 'cascade',
  })
  landlord!: User;
}
