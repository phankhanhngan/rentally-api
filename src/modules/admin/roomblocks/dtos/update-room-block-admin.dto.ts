import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { CustomPointValidation } from 'src/common/customValidation/CustomPointValidation';
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
  @Validate(CustomPointValidation)
  coordinate!: Point;

  @IsString()
  @ValidateIf((obj, value) => value)
  description?: string;

  @IsInt()
  landlordId: number;
}
