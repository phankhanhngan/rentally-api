import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Point } from 'src/entities';

export class AddRoomAdminDTO {
  @IsInt()
  @IsNotEmpty()
  roomBlockId: number;

  roomName?: string;

  @IsDecimal()
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
