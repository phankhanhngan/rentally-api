import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ViewRoomDTO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  roomName: string;

  @ApiProperty()
  @Expose()
  area!: number;

  @ApiProperty()
  @Expose()
  price!: number;

  @ApiProperty()
  @Expose()
  depositAmount!: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => JSON.parse(value || '[]'), {
    toClassOnly: true,
    toPlainOnly: true,
  })
  images: string[];

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => JSON.parse(value || '[]'), {
    toClassOnly: true,
    toPlainOnly: true,
  })
  utilities?: string[];

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose({ name: 'deleted_at' })
  deletedAt: Date;
}
