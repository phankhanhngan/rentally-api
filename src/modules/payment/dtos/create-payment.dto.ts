import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
@Exclude()
export class CreatePaymentDTO {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  rental_id: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  totalPrice: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  electricNumber: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  totalElectricPrice: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  waterNumber: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  totalWaterPrice: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  additionalPrice: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  month: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  year: number;
}
