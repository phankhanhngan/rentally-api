import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ViewRoomDTO {
  @Expose()
  id: number;

  @Expose()
  roomName: string;

  @Expose()
  area!: number;

  @Expose()
  price!: number;

  @Expose()
  depositAmount!: number;

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

  @Expose()
  status: string;
}
