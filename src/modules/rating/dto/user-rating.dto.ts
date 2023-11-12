import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserRatingDTO {
  @ApiProperty()
  @Expose()
  createdAt: Date;
  @ApiProperty()
  @Expose()
  cleanRate: number;
  @ApiProperty()
  @Expose()
  locationRate: number;
  @ApiProperty()
  @Expose()
  securityRate: number;
  @ApiProperty()
  @Expose()
  supportRate: number;
  @ApiProperty()
  @Expose()
  avgRate: number;
  @ApiProperty()
  @Expose()
  renterName: string;
  @ApiProperty()
  @Expose()
  renterPhoto: string;
}
