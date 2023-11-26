import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RenterInformationDTO {
  // Renter Information
  @ApiProperty()
  @Expose({ name: 'id' })
  renterId: number;
  @ApiProperty()
  @Expose()
  firstName: string;
  @ApiProperty()
  @Expose()
  lastName: string;
  @ApiProperty()
  @Expose()
  email: string;
}
