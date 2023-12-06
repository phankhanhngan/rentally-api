import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/common/enum/common.enum';
@Exclude()
export class UserRtnDto {
  @ApiProperty()
  @Expose()
  googleId?: string;

  @ApiProperty()
  @Expose()
  bankCode?: string;

  @ApiProperty()
  @Expose()
  accountNumber?: string;

  @ApiProperty()
  @Expose()
  email!: string | undefined;

  @ApiProperty()
  @Expose()
  firstName!: string;

  @ApiProperty()
  @Expose()
  lastName?: string;

  @ApiProperty()
  @Expose()
  photo?: string;

  @ApiProperty()
  @Expose()
  role!: Role;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  updated_at: Date;

  @ApiProperty()
  @Expose()
  phoneNumber: string;
}
