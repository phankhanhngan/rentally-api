import { Entity, Property, Unique } from "@mikro-orm/core";
import { Base } from "./base.entity";
import { IsEmail, IsPhoneNumber, MinLength } from "class-validator";

@Entity({tableName: "users"})
export class User extends Base {

    @Unique()
    @Property()
    googleId?: string;

    @Unique()
    @Property({ nullable: false })
    @IsEmail()
    email!: string;

    @Property()
    password?: string;

    @Property({ nullable: false })
    @MinLength(2)
    firstName!: string;

    @Property()
    lastName?: string;

    @Property()
    photo?: string;

    @Property({default: true})
    isEnable!: boolean;

    @Property()
    @IsPhoneNumber()
    @Unique()
    phone_number?: string;

    @Property({nullable: false})
    role: Role;
}

export enum Role {
    ADMIN = 'ADMIN',
    MOD = 'MOD',
    USER = 'USER',
  }