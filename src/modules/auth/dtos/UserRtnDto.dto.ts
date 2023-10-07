import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/common/enum/common.enum';
@Exclude()
export class UserRtnDto {
  @Expose()
  googleId?: string;
  @Expose()
  email!: string | undefined;
  @Expose()
  firstName!: string;
  @Expose()
  lastName?: string;
  @Expose()
  photo?: string;
  @Expose()
  role!: Role;
  @Expose()
  id: number;
  @Expose()
  created_at: Date;
  @Expose()
  updated_at: Date;
}
