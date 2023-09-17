import { Entity, Property, Unique } from '@mikro-orm/core';
import { Base } from './base.entity';
import { IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

@Entity({ tableName: 'users' })
export class User extends Base {
  @Unique()
  @Property({ nullable: true })
  googleId?: string;

  @Unique()
  @Property({ nullable: false })
  @IsEmail()
  email!: string;

  @Property({ nullable: true })
  password?: string;

  @Property({ nullable: false })
  @MinLength(2)
  firstName!: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ nullable: true })
  photo?: string;

  @Property({ default: true })
  isEnable!: boolean;

  @Property({ nullable: false })
  @IsPhoneNumber()
  @Unique()
  phone_number!: string;

  @Property({ nullable: false })
  role: Role;

  @Property({ nullable: true })
  verificationCode: string;

  @Property({ nullable: true })
  timeStamp: Date = new Date();
}

export enum Role {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}
