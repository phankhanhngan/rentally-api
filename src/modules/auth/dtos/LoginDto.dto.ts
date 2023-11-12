import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
@Exclude()
export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email!: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  password!: string;
}
