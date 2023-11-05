import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetUserDTO {
  @Expose()
  id!: number;

  @Expose()
  @Transform(({ value, key, obj }) => {
    return `${obj.firstName + obj.lastName}`;
  })
  name: string;

  @Expose()
  photo?: string;

  @Expose()
  phoneNumber: string;

  firstName?: string;
  lastName?: string;
}
