import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AddRoomDTO } from './add-room.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoomModDTO {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  roomBlockId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddRoomDTO)
  rooms: AddRoomDTO[];
}
