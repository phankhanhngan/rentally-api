import { Exclude, Expose } from 'class-transformer';
import { Point, PointType } from 'src/entities';
import { GetUserDTO } from 'src/modules/users/dtos/get-user.dto';

@Exclude()
export class RoomBlockAdminDTO {
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
  @Expose()
  landlord!: GetUserDTO;
}
