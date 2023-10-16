import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateRoomModDTO {

  @ValidateIf((obj, value) => value)
  @IsString({message: "roomName must be a string"})
  roomName?: string;
  
  @ValidateIf((obj, value) => value)
  @IsString()
  area?: string;
  
  @ValidateIf((obj, value) => value)
  @IsNumber({}, { message: 'price must be a number' })
  price?: bigint;

  @ValidateIf((obj, value) => value)
  @IsNumber({}, { message: 'Deposit Amount must be a number' })
  depositAmount?: bigint;

  @ValidateIf((obj, value) => value)
  files?: Express.Multer.File[];

  @ValidateIf((obj, value) => value)
  @IsArray()
  @IsInt({each: true})
  utilitiesArray?: number[];

  @ValidateIf((obj, value) => value)
  @IsNumber()
  idRoomBlock?: number;

}
