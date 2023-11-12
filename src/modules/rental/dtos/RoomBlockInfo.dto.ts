import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class RoomBlockInfoDTO {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  description: string;
  @ApiProperty()
  @Expose()
  address: string;
  @ApiProperty()
  @Expose()
  city: string;
  @ApiProperty()
  @Expose()
  district: string;
  @ApiProperty()
  @Expose()
  longitude: number;
  @ApiProperty()
  @Expose()
  lattitude: number;
}
