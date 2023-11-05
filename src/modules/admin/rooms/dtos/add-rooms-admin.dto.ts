import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AddRoomAdminDTO } from './add-room-admin.dto';

export class AddRoomsAdminDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  roomBlockId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddRoomAdminDTO)
  rooms: AddRoomAdminDTO[];
}
