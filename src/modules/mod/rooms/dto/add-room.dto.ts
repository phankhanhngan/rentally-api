import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class RoomDTO {
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

  files: Express.Multer.File[];

  @ValidateIf((obj, value) => value)
  @IsArray()
  @IsInt({each: true})
  utilities?: number[];
}
