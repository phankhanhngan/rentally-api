import { Exclude, Expose } from 'class-transformer';
import { Point } from 'src/entities';

@Exclude()
export class RoomBlockModDTO {
  @Expose()
  id!: number;
  @Expose()
  addressLine1?: string;
  @Expose()
  addressLine2?: string;
  @Expose()
  city?: string;
  @Expose()
  state?: string;
  @Expose()
  country?: string;
  @Expose()
  coordinate!: Point;
  @Expose()
  description!: string;
}
