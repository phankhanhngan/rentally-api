import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsIn,
  IsInt,
  IsNotEmptyObject,
  IsObject,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateRentalDetailInfo {
  @ApiProperty()
  @IsInt()
  @IsIn([3, 6, 9, 12])
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
  @IsPhoneNumber('VN', { message: 'Invalid Phone number' })
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
