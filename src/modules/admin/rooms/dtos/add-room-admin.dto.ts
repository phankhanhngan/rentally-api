import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AddRoomAdminDTO {
  @IsInt()
  roomBlockId: number;

  @IsString()
  @IsNotEmpty()
  roomName: string;

  @IsNumber()
  area!: number;

  @IsInt()
  price!: bigint;

  @IsInt()
  depositAmount: bigint;

  @IsArray()
  images: string[];

  @IsArray()
  utilities: number[];
}
