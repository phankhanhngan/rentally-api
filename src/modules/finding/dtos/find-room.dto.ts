import { Transform } from 'class-transformer';
import { IsArray, IsNumberString, IsString, ValidateIf } from 'class-validator';

export class FindRoomDTO {
  @ValidateIf((obj, value) => value)
  @IsString()
  keyword?: string;

  @ValidateIf((obj, value) => value)
  @IsString()
  district?: string;

  @ValidateIf((obj, value) => value)
  @IsString()
  province?: string;

  @ValidateIf((obj, value) => value)
  @IsNumberString()
  maxPrice?: number;

  @ValidateIf((obj, value) => value)
  @IsNumberString()
  minPrice?: number = 0;

  @ValidateIf((obj, value) => value)
  @Transform((value) => (Array.isArray(value.value) ? value.value : [value.value]))
  @IsArray()
  @IsNumberString({}, { each: true })
  utilities?: number[];
}
