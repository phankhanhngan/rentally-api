import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class RoomRatingInfoDTO {
  @Expose()
  avgRate: number;
  @Expose()
  numberOfRatings: number;
}
