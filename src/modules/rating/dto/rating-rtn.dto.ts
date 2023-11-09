import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { UserRatingDTO } from './user-rating.dto';
@Exclude()
export class RatingRtnDTO {
  @Expose()
  avgRate?: number;
  @Expose()
  avgClean?: number;
  @Expose()
  avgLocation?: number;
  @Expose()
  avgSecurity?: number;
  @Expose()
  avgSupport?: number;
  @Expose()
  totalRating?: number;
  @Expose()
  ratings: UserRatingDTO[];
}
