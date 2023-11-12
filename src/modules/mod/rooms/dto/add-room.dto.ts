import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class AddRoomDTO {
  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsString({ message: 'roomName must be a string' })
  roomName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'area should not be empty' })
  @IsNumber({}, { message: 'area must be a number' })
  area!: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'price should not be empty' })
  @IsNumber({}, { message: 'price must be a number' })
  price!: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Deposit Amount should not be empty' })
  @IsNumber({}, { message: 'Deposit Amount must be a number' })
  depositAmount!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty()
  @ValidateIf((obj, value) => value)
  @IsArray()
  @IsInt({ each: true })
  utilities?: number[];
}
