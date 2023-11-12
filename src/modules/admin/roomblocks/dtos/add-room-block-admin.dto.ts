import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Point } from 'src/entities';
import { CustomPointValidation } from '../../../../common/customValidation/CustomPointValidation';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoomBlockAdminDTO {
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
