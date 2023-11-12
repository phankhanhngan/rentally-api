import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsInt()
  leaseTerm: number;
  @ApiProperty()
  @IsString()
  moveInDate: string;
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(4)
  numberOfTenants: number;
}

class CreateRentalTenantInfo {
  @ApiProperty()
  @IsString()
  identityNumber: string;
  @ApiProperty()
  @IsString()
  identityDateOfIssue: string;
  @ApiProperty()
  @IsString()
  identityPlaceOfIsse: string;
  @ApiProperty()
  @IsString()
  birthday: string;
  @ApiProperty()
  @IsString()
  phoneNumber: string;
}

export class CreateRentalDTO {
  @ApiProperty()
  @IsString()
  roomId: string;
  @ApiProperty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateRentalTenantInfo)
  tenantInfo: CreateRentalTenantInfo;
  @ApiProperty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateRentalDetailInfo)
  rentalInfo: CreateRentalDetailInfo;
}
