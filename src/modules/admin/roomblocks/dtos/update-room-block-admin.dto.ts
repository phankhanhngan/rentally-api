import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Point, PointType } from 'src/entities';

export class UpdateRoomBlockAdminDTO {
  @IsString()
  @ValidateIf((obj, value) => value)
  addressLine1?: string;

  @IsString()
  @ValidateIf((obj, value) => value)
  addressLine2?: string;

  @IsString()
  @ValidateIf((obj, value) => value)
  city?: string;

  @IsString()
  @ValidateIf((obj, value) => value)
  state?: string;

  @IsString()
  @ValidateIf((obj, value) => value)
  country?: string;

  @IsNotEmpty()
  @Type(() => Point)
  coordinate!: Point;

  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;

  @IsInt()
  landlordId: number;
}
