import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CheckListDTO {
  @Expose()
  roomId!: string;
}
