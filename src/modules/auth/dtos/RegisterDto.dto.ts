import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enum/common.enum';
@Exclude()
export class RegisterDto {
  @ApiProperty()
  @Expose()
  @IsEmail({}, { message: 'Invalid email' })
  email!: string | undefined;

  @ApiProperty()
  @Expose()
  @MinLength(2, { message: 'Password at least 2 characters' })
  password?: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: 'First name cannot be null' })
  @MinLength(2, { message: 'First name at least 2 characters' })
  firstName!: string;

  @ApiProperty()
  @Expose()
  lastName?: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  photo?: string;

  @ApiProperty()
  @Expose()
  @IsPhoneNumber('VN', { message: 'Invalid Phone number' })
  phoneNumber!: string;

  @ApiProperty()
  @Expose()
  role!: Role;

  @ApiProperty()
  @Expose()
  @IsOptional()
  verificationCode?: string;
}
