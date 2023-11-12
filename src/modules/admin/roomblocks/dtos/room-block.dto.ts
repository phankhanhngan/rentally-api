import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Point } from 'src/entities';
import { GetUserDTO } from 'src/modules/users/dtos/get-user.dto';

@Exclude()
export class RoomBlockAdminDTO {
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

  @ApiProperty()
  @Expose()
  landlord!: GetUserDTO;
}
