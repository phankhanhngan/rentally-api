import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Role, UserStatus } from 'src/common/enum/common.enum';

@Exclude()
export class UpdateUserDTO {
  // @Expose()
  // @IsNotEmpty({ message: 'Id update cannot be null' })
  // @Type(() => Number)
  // @IsInt({ message: 'Id update must be an integer' })
  // id!: number;

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
  phoneNumber?: string;

  @Expose()
  @ValidateIf((obj, value) => value)
  @IsIn(['ACTIVE', 'DISABLED', 'REGISTING'], {
    message: 'status must be one of ACTIVE, DISABLED, REGISTING',
  })
  status?: UserStatus;

  @Expose()
  @IsOptional()
  @ValidateIf((obj, value) => value)
  @IsEnum(Role)
  role?: Role;
}
