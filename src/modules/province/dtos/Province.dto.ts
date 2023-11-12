import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class ProvinceDTO {
  @ApiProperty()
  @Expose()
  code: string;
  @ApiProperty()
  @Expose()
  name: string;
}
