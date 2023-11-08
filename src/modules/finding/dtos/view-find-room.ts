import { Exclude, Expose, Transform } from 'class-transformer';
import { Point } from 'src/entities';

@Exclude()
export class ViewFindRoomDTO {
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



  // @Expose()
  // @Transform(({ value }) => JSON.parse(value || '[]'), {
  //   toClassOnly: true,
  //   toPlainOnly: true,
  // })
  utilities?: object[];

  coordinate?: Point;

  address: string;

  district: string;

  avgRate: number;
}
