import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Role } from 'src/common/enum/common.enum';

@Exclude()
export class UserDTO {
  @ApiProperty()
  @Expose()
  @IsEmpty({ message: 'Create without id' })
  id!: number;
  @ApiProperty()
  @Expose()
  googleId?: string;
  @ApiProperty()
  @Expose()
  @IsEmail({}, { message: 'Invalid email' })
  email!: string | undefined;
  @ApiProperty()
  @Expose()
  @ValidateIf((obj, value) => value)
  @MinLength(2, { message: 'Password at least 2 characters' })
  @IsString({ message: 'password must be a string' })
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
  status?: string;
  @ApiProperty()
  @Expose()
  role!: Role;

  @ApiProperty()
  @Expose({ name: 'deleted_at' })
  deletedAt: Date;
  @ApiProperty()
  @Expose()
  verificationCode?: string;
}
