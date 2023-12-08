import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsPhoneNumber, IsString } from 'class-validator';

@Exclude()
export class BecomeHostDTO {
  @ApiProperty()
  @Expose()
  @IsPhoneNumber('VN', { message: 'Invalid Phone number' })
  phoneNumber: string;
  @ApiProperty()
  @Expose()
  @IsString()
  bankCode: string;
  @Expose()
  @IsString()
  accountNumber: string;
}
