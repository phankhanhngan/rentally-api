import { Exclude, Expose, Transform } from 'class-transformer';
import { Point } from 'src/entities';

@Exclude()
export class LandLordDTO {
  @Expose()
  id: number;

  name: string;

  @Expose()
  photo: string;

  @Expose()
  phoneNumber;

  @Expose()
  email: string;

}
