import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class ProvinceDTO {
  @Expose()
  code: string;
  @Expose()
  name: string;
}
