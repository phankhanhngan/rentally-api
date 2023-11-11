import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateRentalDetailInfo {
  @IsInt()
  leaseTerm: number;
  @IsString()
  moveInDate: string;
  @IsInt()
  @Min(1)
  @Max(4)
  numberOfTenants: number;
}

class CreateRentalTenantInfo {
  @IsString()
  identityNumber: string;
  @IsString()
  identityDateOfIssue: string;
  @IsString()
  identityPlaceOfIsse: string;
  @IsString()
  birthday: string;
  @IsString()
  phoneNumber: string;
}

export class CreateRentalDTO {
  @IsString()
  roomId: string;
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateRentalTenantInfo)
  tenantInfo: CreateRentalTenantInfo;
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateRentalDetailInfo)
  rentalInfo: CreateRentalDetailInfo;
}
