import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
@Exclude()
export class UpdatePaymentDTO {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  electricNumber: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  waterNumber: number;

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
