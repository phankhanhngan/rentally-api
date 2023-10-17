import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UtilitiesDTO {
  @Expose()
  name: string;
  @Expose()
  note: string;
}
