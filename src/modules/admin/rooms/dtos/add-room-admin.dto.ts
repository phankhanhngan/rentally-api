import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Point } from 'src/entities';

export class AddRoomAdminDTO {
  @IsInt()
  @IsNotEmpty()
  roomBlockId: number;

  roomName?: string;

  @IsNumber()
  @IsNotEmpty()
  area!: number;

  @IsInt()
  @IsNotEmpty()
  price!: bigint;

  @IsInt()
  @IsNotEmpty()
  depositAmount?: bigint;

  utilities: number[];
}
