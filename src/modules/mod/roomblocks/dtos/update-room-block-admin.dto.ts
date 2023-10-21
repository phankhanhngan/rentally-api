import { Type } from 'class-transformer';
import { IsString, Validate, ValidateIf } from 'class-validator';
import { Point } from 'src/entities';
import { IsCoordinateFormat } from '../helpers/IsCoordinate.helper';

export class UpdateRoomBlockModDTO {
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

  @ValidateIf((obj, value) => value)
  @Validate(IsCoordinateFormat)
  @Type(() => Point)
  coordinate!: Point;

  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;

}
