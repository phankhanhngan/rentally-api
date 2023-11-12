import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class UtilitiesDTO {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  note: string;

  @ApiProperty()
  @Expose()
  icon: string;
}
