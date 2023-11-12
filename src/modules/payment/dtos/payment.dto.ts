import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { MyRentalDTO } from 'src/modules/rental/dtos/MyRental.dto';
@Exclude()
export class PaymentDTO {
  @ApiProperty()
  @Expose()
  rental: number;

  @ApiProperty()
  @Expose()
  totalPrice: number;

  @ApiProperty()
  @Expose()
  electricNumber: number;

  @ApiProperty()
  @Expose()
  totalElectricPrice: number;

  @ApiProperty()
  @Expose()
  waterNumber: number;

  @ApiProperty()
  @Expose()
  totalWaterPrice: number;

  @ApiProperty()
  @Expose()
  additionalPrice: number;

  @ApiProperty()
  @Expose()
  month: number;

  @ApiProperty()
  @Expose()
  year: number;
}
