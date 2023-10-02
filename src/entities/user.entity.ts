import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import { Base } from './base.entity';
import { IsEmail, IsPhoneNumber, MaxLength, MinLength } from 'class-validator';
import { Role, UserStatus } from '../common/enum/common.enum';
// import { Role, UserStatus } from 'src/common/enum/common.enum';

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

  @Property({ nullable: false })
  @Enum({ items: () => UserStatus })
  status: UserStatus;

  @Property({ nullable: false })
  @IsPhoneNumber()
  @Unique()
  phoneNumber!: string;

  @Property({ nullable: false })
  @Enum({ items: () => Role })
  role: Role;

  @Property({ nullable: true, length: 510 })
  verificationCode: string;

  @Property({ nullable: true })
  timeStamp: Date = new Date();
}
