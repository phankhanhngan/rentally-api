import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Min,
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
  @Min(0)
  electricPrice: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  waterPrice: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  leaseTerminationCost: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
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
