import { Entity, Type, Property, ManyToOne } from '@mikro-orm/core';
import { Base } from './base.entity';
import { User } from './user.entity';

export class Point {
  constructor(public latitude: number, public longitude: number) {}
}

export class PointType extends Type<Point | undefined, string | undefined> {
  convertToDatabaseValue(value: Point | undefined): string | undefined {
    // if (!value) {
    //   return value;
    // }
    return `point(${value.latitude} ${value.longitude})`;
  }

  convertToJSValue(value: string | undefined): Point | undefined {
    const m = value?.match(/point\((-?\d+(\.\d+)?) (-?\d+(\.\d+)?)\)/i);

    if (!m) {
      return undefined;
    }

    return new Point(+m[1], +m[3]);
  }

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
  @Property({ type: 'text', nullable: true })
  addressLine1?: string;

  @Property({ type: 'text', nullable: true })
  addressLine2?: string;

  @Property({ type: 'text', nullable: true })
  city?: string;

  @Property({ type: 'text', nullable: true })
  state?: string;

  @Property({ type: 'text', nullable: true })
  country?: string;

  @Property({ type: PointType, nullable: false })
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
