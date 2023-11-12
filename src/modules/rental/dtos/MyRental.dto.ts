import { Exclude, Expose } from 'class-transformer';
import { RoomBlockInfoDTO } from './RoomBlockInfo.dto';
import { HostInfoDTO } from './HostInfo.dto';
import { RoomInfoDTO } from './RoomInfo.dto';
import { RentalInfoDTO } from './RentalInfo.dto';
import { RenterInfoDTO } from './RenterInfo.dto';
import { ApiProperty } from '@nestjs/swagger';
@Exclude()
export class MyRentalDTO {
  @ApiProperty()
  @Expose()
  roomBlockInfo: RoomBlockInfoDTO;
  @ApiProperty()
  @Expose()
  hostInfo: HostInfoDTO;
  @ApiProperty()
  @Expose()
  roomInfo: RoomInfoDTO;
  @ApiProperty()
  @Expose()
  rentalInfo: RentalInfoDTO;
  @ApiProperty()
  @Expose()
  renterInfo: RenterInfoDTO;
}
