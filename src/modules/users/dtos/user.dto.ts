import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enum/common.enum';

@Exclude()
export class UserDTO {
  @Expose()
  @IsEmpty({ message: 'Create without id' })
  id!: number;

  @Expose()
  googleId?: string;

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
  phoneNumber!: string;

  @Expose()
  status?: string;

  @Expose()
  role!: Role;

  @Expose({ name: 'deleted_at' })
  deletedAt: Date;

  @Expose()
  verificationCode?: string;
}
