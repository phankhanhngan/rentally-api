import { IsArray, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

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

  @IsArray()
  images: string[];

  @IsArray()
  utilities: number[];
}
