import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class BecomeHostDTO {
  @ApiProperty()
  @Expose()
  @IsString()
  phoneNumber: string;
  @ApiProperty()
  @Expose()
  @IsString()
  bankCode: string;
  @ApiProperty()
  @Expose()
  @IsString()
  accountNumber: string;
}
