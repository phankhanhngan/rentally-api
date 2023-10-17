import { IsArray, IsInt, IsNotEmpty, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { AddRoomDTO } from './add-room.dto';

export class AddRoomModDTO {
  
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  roomBlockId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddRoomDTO)
  rooms: AddRoomDTO[];
}
