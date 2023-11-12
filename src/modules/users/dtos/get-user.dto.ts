import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetUserDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value, key, obj }) => {
    return `${obj.firstName + obj.lastName}`;
  })
  name: string;

  @ApiProperty()
  @Expose()
  photo?: string;

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose({ name: 'deleted_at' })
  deletedAt: Date;

  firstName?: string;
  lastName?: string;
}
