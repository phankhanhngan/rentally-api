import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetUserDTO {
  @Expose()
  id!: number;

  @Expose()
  name: string;

  @Expose()
  photo?: string;

  @Expose()
  phoneNumber: string;
}
