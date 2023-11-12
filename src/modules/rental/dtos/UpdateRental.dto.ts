import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class UpdateRentalHostInfo {
  @ApiProperty()
  @IsString()
  identityNumber: string;
  @ApiProperty()
  @IsString()
  identityDateOfIssue: string;
  @ApiProperty()
  @IsString()
  identityPlaceOfIssue: string;
  @ApiProperty()
  @IsString()
  birthday: string;
}

class UpdateRentalInfo {
  @ApiProperty()
  @IsInt()
  electricPrice: number;
  @ApiProperty()
  @IsInt()
  waterPrice: number;
  @ApiProperty()
  @IsInt()
  leaseTerminationCost: number;
  @ApiProperty()
  @IsInt()
  additionalPrice: number;
}

export class UpdateRentalDTO {
  @ApiProperty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateRentalHostInfo)
  hostInfo: UpdateRentalHostInfo;
  @ApiProperty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateRentalInfo)
  rentalInfo: UpdateRentalInfo;
}
