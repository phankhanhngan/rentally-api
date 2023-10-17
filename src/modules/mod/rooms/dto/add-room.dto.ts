import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class AddRoomDTO {
  @ValidateIf((obj, value) => value)
  @IsString({message: "roomName must be a string"})
  roomName: string;
  
  @IsNotEmpty({message: "area should not be empty"})
  @IsNumber({}, { message: 'area must be a number' })
  area!: number;

  @IsNotEmpty({message: "price should not be empty"})
  @IsNumber({}, { message: 'price must be a number' })
  price!: number;

  @IsNotEmpty({message: "Deposit Amount should not be empty"})
  @IsNumber({}, { message: 'Deposit Amount must be a number' })
  depositAmount!: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({each: true})
  // @Transform(({ value }) => JSON.stringify(value || '[]'), { toClassOnly: true, toPlainOnly: true })
  images: string;

  @ValidateIf((obj, value) => value)
  @IsArray()
  @IsInt({each: true})
  utilities?: number[];
}
