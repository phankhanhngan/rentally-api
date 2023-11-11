import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class RoomBlockInfoDTO {
  @Expose()
  id: number;
  @Expose()
  description: string;
  @Expose()
  address: string;
  @Expose()
  city: string;
  @Expose()
  district: string;
  @Expose()
  longitude: number;
  @Expose()
  lattitude: number;
}
