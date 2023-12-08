import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaymentStatus } from 'src/common/enum/common.enum';
import { MyRentalDTO } from 'src/modules/rental/dtos/MyRental.dto';
@Exclude()
export class PaymentDTO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  rental: MyRentalDTO;

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

  @ApiProperty()
  @Expose()
  status: PaymentStatus;

  @ApiProperty()
  @Expose()
  paidAt: Date;

  @ApiProperty()
  @Expose()
  expirationDate: Date;

  @ApiProperty()
  @Expose()
  deleted_at: Date;
}
