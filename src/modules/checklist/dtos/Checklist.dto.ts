import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CheckListDTO {
  @ApiProperty()
  @Expose()
  roomId!: string;
}
