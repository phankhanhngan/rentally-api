import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumberString,
  IsString,
  ValidateIf,
} from 'class-validator';

export class FindRoomDTO {
  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsString()
  keyword?: string;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsString()
  district?: string;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsString()
  province?: string;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsNumberString()
  maxPrice?: number;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsNumberString()
  minPrice?: number = 0;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @Transform(({ value }) => (value ? value.split(',').map(Number) : []))
  utilities?: number[];

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsNumberString()
  perPage?: number;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsNumberString()
  page?: number;
}
