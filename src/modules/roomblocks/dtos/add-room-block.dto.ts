import { IsNotEmpty } from 'class-validator';
import { Point } from 'src/entities/room-block.entity';

export class AddRoomBlockDTO {
  @IsNotEmpty()
  address!: string;

  @IsNotEmpty()
  longitude!: number;

  @IsNotEmpty()
  latitude!: number;

  description?: string;
}
