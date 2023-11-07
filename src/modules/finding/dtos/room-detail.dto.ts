import { Exclude, Expose, Transform } from 'class-transformer';
import { Point, RoomBlock } from 'src/entities';

@Exclude()
export class RoomDetailDTO {
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

  //   description: string;

  //   coordinate: Point;

  //   address: string;

  //   district: string;

  //   city: string;

  //   country: string;

  @Expose()
  roomblock: RoomBlock;

  rating: number;

  ratingNumber: number;
}
