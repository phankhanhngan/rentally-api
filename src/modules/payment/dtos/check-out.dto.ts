import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
export class CheckOutDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  paymentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  electricNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalElectricPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  waterNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  totalWaterPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  additionalPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  month: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  year: number;
}
