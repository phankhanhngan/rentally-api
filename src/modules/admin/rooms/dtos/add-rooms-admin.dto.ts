import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AddRoomAdminDTO } from './add-room-admin.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoomsAdminDTO {
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
  @Type(() => AddRoomAdminDTO)
  rooms: AddRoomAdminDTO[];
}
