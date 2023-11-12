import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateRoomModDTO {
  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsString({ message: 'roomName must be a string' })
  roomName?: string;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsNumber()
  area?: number;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsNumber({}, { message: 'price must be a number' })
  price?: bigint;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsNumber({}, { message: 'Deposit Amount must be a number' })
  depositAmount?: bigint;

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsArray()
  @IsInt({ each: true })
  utilities?: number[];

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsNumber()
  idRoomBlock?: number;
}
