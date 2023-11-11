import { Exclude, Expose } from 'class-transformer';
import { RoomBlockInfoDTO } from './RoomBlockInfo.dto';
import { HostInfoDTO } from './HostInfo.dto';
import { RoomInfoDTO } from './RoomInfo.dto';
import { RentalInfoDTO } from './RentalInfo.dto';
import { RenterInfoDTO } from './RenterInfo.dto';
@Exclude()
export class MyRentalDTO {
  @Expose()
  roomBlockInfo: RoomBlockInfoDTO;
  @Expose()
  hostInfo: HostInfoDTO;
  @Expose()
  roomInfo: RoomInfoDTO;
  @Expose()
  rentalInfo: RentalInfoDTO;
  @Expose()
  renterInfo: RenterInfoDTO;
}
