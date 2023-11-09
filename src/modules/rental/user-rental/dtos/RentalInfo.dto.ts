import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class RentalInfoDTO {
  @Expose()
  id: number;
  @Expose()
  rentalDetailId: number;
  @Expose()
  leaseTerm: number;
  @Expose()
  moveInDate: Date;
  @Expose()
  moveOutDate: Date;
  @Expose()
  numberOfTenants: number;
  @Expose()
  electricPrice: number;
  @Expose()
  waterPrice: number;
  @Expose()
  leaseTerminationCost: number;
  @Expose()
  additionalPrice: number;
}
