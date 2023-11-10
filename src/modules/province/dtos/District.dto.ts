import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class DistrictDTO {
  @Expose()
  code: string;
  @Expose()
  name: string;
}
