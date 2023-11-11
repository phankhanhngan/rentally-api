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
  @IsString()
  identityNumber: string;
  @IsString()
  identityDateOfIssue: string;
  @IsString()
  identityPlaceOfIssue: string;
  @IsString()
  birthday: string;
}

class UpdateRentalInfo {
  @IsInt()
  electricPrice: number;
  @IsInt()
  waterPrice: number;
  @IsInt()
  leaseTerminationCost: number;
  @IsInt()
  additionalPrice: number;
}

export class UpdateRentalDTO {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateRentalHostInfo)
  hostInfo: UpdateRentalHostInfo;
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateRentalInfo)
  rentalInfo: UpdateRentalInfo;
}
