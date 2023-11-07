import { Exclude, Expose, Transform } from 'class-transformer';

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

  @Expose()
  @Transform(({ value }) => JSON.parse(value || '[]'), {
    toClassOnly: true,
    toPlainOnly: true,
  })
  utilities?: string[];

  address: string;

  district: string;

  rating: number;
}
