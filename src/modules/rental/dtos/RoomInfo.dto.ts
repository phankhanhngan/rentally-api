import { Exclude, Expose } from 'class-transformer';
import { RoomRatingInfoDTO } from './RoomRatingInfo.dto';
import { ApiProperty } from '@nestjs/swagger';
@Exclude()
export class RoomInfoDTO {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  roomName: string;
  @ApiProperty()
  @Expose()
  area: number;
  @ApiProperty()
  @Expose()
  price: bigint;
  @ApiProperty()
  @Expose()
  depositAmount: bigint;
  @ApiProperty()
  @Expose()
  images: string;
  @ApiProperty()
  @Expose()
  utilities: string[];
  @ApiProperty()
  @Expose()
  roomRatings: RoomRatingInfoDTO;
}
