import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { RoomDTO } from './add-room.dto';
import { Type } from 'class-transformer';

export class AddRoomModDTO {
  @IsInt()
  @IsNotEmpty()
  roomBlockId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDTO)
  rooms: RoomDTO[];
}
