import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class HostInfoDTO {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  photo: string;
  @ApiProperty()
  @Expose()
  firstName: string;
  @ApiProperty()
  @Expose()
  lastName: string;
  @ApiProperty()
  @Expose()
  email: string;
  @ApiProperty()
  @Expose()
  phone: string;
  @ApiProperty()
  @Expose()
  identityNumber: string;
  @ApiProperty()
  @Expose()
  identityDateOfIssue: Date;
  @ApiProperty()
  @Expose()
  identityPlaceOfIssue: string;
  @ApiProperty()
  @Expose()
  birthday: Date;
  @ApiProperty()
  @Expose()
  electricPrice?: number;
  @ApiProperty()
  @Expose()
  waterPrice?: number;
}
