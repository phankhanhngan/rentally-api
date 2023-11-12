import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { CustomPointValidation } from 'src/common/customValidation/CustomPointValidation';
import { Point } from 'src/entities';

export class UpdateRoomBlockAdminDTO {
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
  @Type(() => Point)
  @Validate(CustomPointValidation)
  coordinate!: Point;

  @ApiProperty()
  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;

  @ApiProperty()
  @IsInt()
  landlordId: number;
}
