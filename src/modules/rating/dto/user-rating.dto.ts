import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserRatingDTO {
  @Expose()
  createdAt: Date;
  @Expose()
  cleanRate: number;
  @Expose()
  locationRate: number;
  @Expose()
  securityRate: number;
  @Expose()
  supportRate: number;
  @Expose()
  avgRate: number;
  @Expose()
  renterName: string;
  @Expose()
  renterPhoto: string;
}
