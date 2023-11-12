import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEnum,
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
  @IsDate()
  moveInDate: Date;
  @IsInt()
  @Min(1)
  @Max(4)
  numberOfTenants: number;
}

class CreateRentalTenantInfo {
  @IsString()
  identityNumber: string;
  @IsDate()
  identityDateOfIssue: Date;
  @IsString()
  identityPlaceOfIsse: string;
  @IsDate()
  birthday: Date;
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
