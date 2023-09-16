import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/entities';

@Exclude()
export class UserDTO {
  @Expose()
  id!: number;

  @Expose()
  googleId?: string;

  @Expose()
  @IsEmail({}, {message: 'Invalid email'})
  email!: string;

  @Expose()
  @MinLength(2, {message: 'Password at least 2 characters'})
  password?: string;

  @Expose()
  @IsNotEmpty({message: 'First name cannot be null'})
  firstName!: string;

  @Expose()
  lastName?: string;

  @Expose()
  photo?: string;
  
  @Expose()
//   @IsPhoneNumber('VN', {message: 'Invalid Phone number'})
  phone_number?: string;

  @Expose()
  role!: Role;
}
