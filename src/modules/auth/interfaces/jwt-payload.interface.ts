import { Role } from 'src/entities';
import { UserRtnDto } from '../dtos/UserRtnDto.dto';

export interface IAuthPayload {
  user: UserRtnDto;
}
