import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Point } from 'src/entities';

@Exclude()
export class ViewFindRoomDTO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  price!: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => JSON.parse(value || '[]'), {
    toClassOnly: true,
    toPlainOnly: true,
  })
  images: string[];

  // @Expose()
  // @Transform(({ value }) => JSON.parse(value || '[]'), {
  //   toClassOnly: true,
  //   toPlainOnly: true,
  // })
  @ApiProperty()
  utilities?: object[];

  @ApiProperty()
  coordinate?: Point;

  @ApiProperty()
  address: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  avgRate: number;

  // move_out_date: Date;
}
