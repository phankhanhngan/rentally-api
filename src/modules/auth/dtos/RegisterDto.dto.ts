import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';
import { Role } from 'src/entities';
@Exclude()
export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email!: string;

  @IsNotEmpty()
  @Expose()
  password!: string;

  @IsNotEmpty()
  @Expose()
  @MinLength(2)
  firstName!: string;

  @IsNotEmpty()
  @Expose()
  lastName!: string;

  @IsPhoneNumber()
  @Expose()
  phone_number?: string;

  @Expose()
  @IsNotEmpty()
  role: Role;
}
