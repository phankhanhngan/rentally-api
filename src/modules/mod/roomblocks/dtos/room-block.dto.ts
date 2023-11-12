import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Point } from 'src/entities';

@Exclude()
export class RoomBlockModDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  address?: string;

  @ApiProperty()
  @Expose()
  city?: string;

  @ApiProperty()
  @Expose()
  district?: string;

  @ApiProperty()
  @Expose()
  country?: string;

  @ApiProperty()
  @Expose()
  coordinate!: Point;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty()
  @Expose({ name: 'deleted_at' })
  deletedAt: Date;

  quantityRooms!: number;
  emptyRooms!: number;
}
