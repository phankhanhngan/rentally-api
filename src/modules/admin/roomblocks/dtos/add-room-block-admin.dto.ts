import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Point } from 'src/entities';

export class AddRoomBlockAdminDTO {
  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @Type(() => Point)
  coordinate!: Point;

  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;

  @IsInt()
  landlordId: number;
}
