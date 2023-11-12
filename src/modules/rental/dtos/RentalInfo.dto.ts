import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class RentalInfoDTO {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  rentalDetailId: number;
  @ApiProperty()
  @Expose()
  leaseTerm: number;
  @ApiProperty()
  @Expose()
  moveInDate: Date;
  @ApiProperty()
  @Expose()
  moveOutDate: Date;
  @ApiProperty()
  @Expose()
  numberOfTenants: number;
  @ApiProperty()
  @Expose()
  electricPrice: number;
  @ApiProperty()
  @Expose()
  waterPrice: number;
  @ApiProperty()
  @Expose()
  leaseTerminationCost: number;
  @ApiProperty()
  @Expose()
  additionalPrice: number;
}
