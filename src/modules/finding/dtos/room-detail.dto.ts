import { Exclude, Expose, Transform } from 'class-transformer';
import { Point, RoomBlock } from 'src/entities';
import { LandLordDTO } from './landlord.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RoomDetailDTO {
  landlord: LandLordDTO;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  roomName: string;
  
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

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => JSON.parse(value || '[]'), {
    toClassOnly: true,
    toPlainOnly: true,
  })
  utilities?: string[];

  //   coordinate: Point;

  //   address: string;

  //   district: string;

  //   city: string;

  //   country: string;

  @ApiProperty()
  @Expose()
  roomblock: RoomBlock;

  ratingDetail: object;
}
