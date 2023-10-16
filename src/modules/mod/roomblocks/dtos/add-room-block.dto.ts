import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Validate, ValidateIf } from 'class-validator';
import { Point } from 'src/entities';
import { IsCoordinateFormat } from '../helpers/IsCoordinate.helper';

export class AddRoomBlockModDTO {
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
  @Validate(IsCoordinateFormat)
  @Type(() => Point)
  coordinate!: Point;

  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;

}
