import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Role } from 'src/entities';
@Exclude()
export class RegisterDto {
  @Expose()
  @IsEmail({}, { message: 'Invalid email' })
  email!: string | undefined;

  @Expose()
  @MinLength(2, { message: 'Password at least 2 characters' })
  password?: string;

  @Expose()
  @IsNotEmpty({ message: 'First name cannot be null' })
  @MinLength(2, { message: 'First name at least 2 characters' })
  firstName!: string;

  @Expose()
  lastName?: string;

  @Expose()
  @IsOptional()
  photo?: string;

  @Expose()
  @IsPhoneNumber('VN', { message: 'Invalid Phone number' })
  phone_number!: string;

  @Expose()
  role!: Role;

  @Expose()
  @IsOptional()
  verificationCode?: string;
}
