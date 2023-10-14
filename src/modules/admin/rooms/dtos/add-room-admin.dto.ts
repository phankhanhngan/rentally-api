import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Point } from 'src/entities';

export class AddRoomBlockAdminDTO {
  @IsInt()
  @IsNotEmpty()
  roomBlockId: number;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @Type(() => Point)
  coordinate!: Point;

  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;
}
