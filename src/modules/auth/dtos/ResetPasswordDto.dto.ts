import { IsEmail, IsNotEmpty } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  code!: string;
}
