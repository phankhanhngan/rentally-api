import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Validate, ValidateIf } from 'class-validator';
import { Point } from 'src/entities';
import { IsCoordinateFormat } from '../helpers/IsCoordinate.helper';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoomBlockModDTO {
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
  @IsNotEmpty()
  @Validate(IsCoordinateFormat)
  @Type(() => Point)
  coordinate!: Point;

  @ApiProperty()
  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;
}
