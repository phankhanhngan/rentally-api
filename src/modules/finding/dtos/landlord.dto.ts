import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Point } from 'src/entities';

@Exclude()
export class LandLordDTO {
  @ApiProperty()
  @Expose()
  id: number;

  name: string;

  @ApiProperty()
  @Expose()
  photo: string;

  @ApiProperty()
  @Expose()
  phoneNumber;

  @ApiProperty()
  @Expose()
  email: string;
}
