import { Exclude, Expose } from 'class-transformer';
import { RoomRatingInfoDTO } from './RoomRatingInfo.dto';
@Exclude()
export class RoomInfoDTO {
  @Expose()
  id: string;
  @Expose()
  roomName: string;
  @Expose()
  area: number;
  @Expose()
  price: bigint;
  @Expose()
  depositAmount: bigint;
  @Expose()
  images: string;
  @Expose()
  utilities: string;
  @Expose()
  roomRatings: RoomRatingInfoDTO;
}
