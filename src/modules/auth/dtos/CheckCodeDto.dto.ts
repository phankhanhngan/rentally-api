import { IsEmail, IsNotEmpty } from 'class-validator';
export class CheckCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  code: string;
}
