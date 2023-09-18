import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
@Exclude()
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email!: string;

  @Expose()
  @IsNotEmpty()
  password!: string;
}
