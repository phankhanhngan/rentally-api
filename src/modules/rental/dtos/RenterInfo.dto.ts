import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class RenterInfoDTO {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  firstName: string;
  @ApiProperty()
  @Expose()
  lastname: string;
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
}
