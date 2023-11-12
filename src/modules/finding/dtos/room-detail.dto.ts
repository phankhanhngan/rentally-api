import { Exclude, Expose, Transform } from 'class-transformer';
import { Point, RoomBlock } from 'src/entities';
import { LandLordDTO } from './landlord.dto';

@Exclude()
export class RoomDetailDTO {

  landlord: LandLordDTO;

  @Expose()
  id: number;

  @Expose()
  price!: number;

  @Expose()
  @Transform(({ value }) => JSON.parse(value || '[]'), {
    toClassOnly: true,
    toPlainOnly: true,
  })
  images: string[];

  @Expose()
  @Transform(({ value }) => JSON.parse(value || '[]'), {
    toClassOnly: true,
    toPlainOnly: true,
  })
  utilities?: string[];

  //   coordinate: Point;

  //   address: string;

  //   district: string;

  //   city: string;

  //   country: string;

  @Expose()
  roomblock: RoomBlock;

  ratingDetail: object;
}
