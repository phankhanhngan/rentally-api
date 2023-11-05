import { Exclude, Expose } from 'class-transformer';
import { Point } from 'src/entities';
import { GetUserDTO } from 'src/modules/users/dtos/get-user.dto';

@Exclude()
export class RoomBlockAdminDTO {
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
  @Expose()
  landlord!: GetUserDTO;
}
