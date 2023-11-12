import { Exclude, Expose } from 'class-transformer';
import { UserRatingDTO } from './user-rating.dto';
import { ApiProperty } from '@nestjs/swagger';
@Exclude()
export class RatingRtnDTO {
  @ApiProperty()
  @Expose()
  avgRate?: number;
  @ApiProperty()
  @Expose()
  avgClean?: number;
  @ApiProperty()
  @Expose()
  avgLocation?: number;
  @ApiProperty()
  @Expose()
  avgSecurity?: number;
  @ApiProperty()
  @Expose()
  avgSupport?: number;
  @ApiProperty()
  @Expose()
  totalRating?: number;
  @ApiProperty()
  @Expose()
  ratings: UserRatingDTO[];
}
