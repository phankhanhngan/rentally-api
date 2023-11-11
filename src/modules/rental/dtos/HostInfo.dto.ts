import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class HostInfoDTO {
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
  @Expose()
  electricPrice?: number;
  @Expose()
  waterPrice?: number;
}
