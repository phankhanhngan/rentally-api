import { Exclude, Expose } from 'class-transformer';
import { Point } from 'src/entities';

@Exclude()
export class RoomBlockModDTO {
  @Expose()
  id!: number;
  @Expose()
  address?: string;
  @Expose()
  city?: string;
  @Expose()
  district?: string;
  @Expose()
  country?: string;
  @Expose()
  coordinate!: Point;
  @Expose()
  description!: string;
  @Expose({ name: 'deleted_at' })
  deletedAt: Date;

  quantityRooms!: number;
  emptyRooms!: number;
}
