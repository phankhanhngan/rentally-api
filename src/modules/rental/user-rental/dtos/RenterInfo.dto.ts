import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class RenterInfoDTO {
  @Expose()
  id: number;
  @Expose()
  firstName: string;
  @Expose()
  lastname: string;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  identityNumber: string;
  @Expose()
  identityDateOfIssue: Date;
  @Expose()
  identityPlaceOfIssue: string;
  @Expose()
  birthday: Date;
}
