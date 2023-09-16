import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
@Exclude()
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email!: string;

  @IsNotEmpty()
  @Expose()
  password!: string;
}
