import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Role } from 'src/entities';

@Exclude()
export class UpdateUserDTO {
  @Expose()
  @IsNotEmpty({ message: 'Id login cannot be null' })
  @IsInt({ message: 'id login must be an integer' })
  idLogin!: number;

  @Expose()
  @IsNotEmpty({ message: 'Id update cannot be null' })
  @IsInt({ message: 'id update must be an integer' })
  id!: number;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsEmail({}, { message: 'Invalid email' })
  email?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @MinLength(2, { message: 'Password at least 2 characters' })
  @IsString({ message: 'password must be a string' })
  password?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsNotEmpty({ message: 'First name cannot be null' })
  @MinLength(2, { message: 'First name at least 2 characters' })
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsString({ message: 'Photo must be a string' })
  photo?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsPhoneNumber('VN', { message: 'Invalid Phone number' })
  @IsString({ message: 'Photo must be a string' })
  phone_number?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsBoolean({ message: 'isEnable must be a boolean' })
  isEnable?: boolean;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsEnum(Role)
  role?: Role;
}
