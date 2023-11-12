import { Type } from 'class-transformer';
import { IsString, Validate, ValidateIf } from 'class-validator';
import { Point } from 'src/entities';
import { IsCoordinateFormat } from '../helpers/IsCoordinate.helper';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomBlockModDTO {
  @ApiProperty()
  @IsString()
  @ValidateIf((obj, value) => value)
  address?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((obj, value) => value)
  city?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((obj, value) => value)
  district?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((obj, value) => value)
  country?: string;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @Validate(IsCoordinateFormat)
  @Type(() => Point)
  coordinate!: Point;

  @ApiProperty()
  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;
}
