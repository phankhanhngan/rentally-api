import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Point } from 'src/entities';

export class AddRoomBlockDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  address!: string;

  @IsNotEmpty()
  @ApiProperty()
  coordinate!: Point;

  @IsString()
  @ApiProperty()
  description?: string;

  @IsInt()
  @ApiProperty()
  landlordId?: number;
}
