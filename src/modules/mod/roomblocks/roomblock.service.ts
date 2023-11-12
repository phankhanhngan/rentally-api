import {
  EntityRepository,
  EntityManager,
  PopulateHint,
  Loaded,
  wrap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User, RoomBlock, Room } from 'src/entities';
import { AddRoomBlockModDTO } from './dtos/add-room-block.dto';
import { UpdateRoomBlockModDTO } from './dtos/update-room-block-admin.dto';
import { RoomBlockModDTO } from './dtos/room-block.dto';
import { RoomStatus } from 'src/common/enum/common.enum';
import { ViewRoomDTO } from '../rooms/dto/view-room.dto';

@Injectable()
export class ModRoomBlocksService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(RoomBlock)
    private readonly roomBlockRepository: EntityRepository<RoomBlock>,
    @InjectRepository(Room)
    private readonly roomRepository: EntityRepository<Room>,
    private readonly em: EntityManager,
  ) {}

  async addRoomBlock(user: User, dto: AddRoomBlockModDTO) {
    try {
      const landlordId = user.id;

      const roomBlockEntity = plainToInstance(RoomBlock, dto);
      roomBlockEntity.created_id = user.id;
      roomBlockEntity.updated_id = user.id;
      roomBlockEntity.landlord = this.em.getReference(User, landlordId);
      await this.em.persistAndFlush(roomBlockEntity);
    } catch (error) {
      this.logger.error(
        'Calling addRoomBlock()',
        error,
        ModRoomBlocksService.name,
      );
      throw error;
    }
  }

  async updateRoomBlock(user: User, id: number, dto: UpdateRoomBlockModDTO) {
    try {
      const roomBlockEntity: Loaded<RoomBlock> =
        await this.roomBlockRepository.findOne({
          id: id,
          landlord: { id: user.id },
        });
      if (!roomBlockEntity) {
        throw new BadRequestException(
          `Can not find room block with id=[${id}]`,
        );
      }

      wrap(roomBlockEntity).assign(
        {
          ...dto,
          updated_at: new Date(),
          updated_id: user.id,
          landlord: this.em.getReference(User, user.id),
        },
        { updateByPrimaryKey: false },
      );

      await this.em.persistAndFlush(roomBlockEntity);
    } catch (error) {
      this.logger.error(
        'Calling updateRoomBlock()',
        error,
        ModRoomBlocksService.name,
      );
      throw error;
    }
  }

  async deleteRoomBlock(id: number, idUser: number) {
    try {
      const roomBlock = await this.roomBlockRepository.findOne({
        id,
        landlord: { id: idUser },
      });
      if (!roomBlock) {
        throw new BadRequestException(
          `Can not find room block with id=[${id}]`,
        );
      }
      roomBlock.deleted_at = new Date();
      await this.em.persistAndFlush(roomBlock);
    } catch (error) {
      this.logger.error(
        'Calling deleteRoomBlock()',
        error,
        ModRoomBlocksService.name,
      );
      throw error;
    }
  }

  async getRoomBlock(id: number, idUser: number): Promise<RoomBlockModDTO> {
    try {
      const roomBlockEntity = await this.roomBlockRepository.findOne({
        id,
        landlord: { id: idUser },
      });
      if (!roomBlockEntity) {
        throw new BadRequestException(
          `Can not find room block with id=[${id}]`,
        );
      }
      const roomBlockDto = plainToInstance(RoomBlockModDTO, roomBlockEntity);

      roomBlockDto.quantityRooms = await this.roomRepository.count({
        roomblock: { id: roomBlockDto.id },
      });
      roomBlockDto.emptyRooms = await this.roomRepository.count({
        roomblock: { id: roomBlockDto.id },
        status: RoomStatus.EMPTY,
      });

      return roomBlockDto;
    } catch (error) {
      this.logger.error(
        'Calling getRoomBlock()',
        error,
        ModRoomBlocksService.name,
      );
      throw error;
    }
  }

  async getRoomBlockList(keyword: string, idUser: number) {
    try {
      if (!keyword) keyword = '';
      const likeQr = { $like: `%${keyword}%` };
      const queryObj = {
        $or: [
          {
            landlord: {
              $or: [
                { firstName: likeQr },
                { lastName: likeQr },
                { phoneNumber: likeQr },
              ],
            },
          },
          { address: likeQr },
          { city: likeQr },
          { district: likeQr },
          { country: likeQr },
          { description: likeQr },
        ],
      };
      const roomBlockEntityList = await this.roomBlockRepository.find(
        {
          $and: [queryObj, { landlord: { id: idUser } }],
        },
        {
          populate: ['landlord'],
          populateWhere: PopulateHint.INFER,
        },
      );

      console.log(roomBlockEntityList);
      
      const dtos = plainToClass(RoomBlockModDTO, roomBlockEntityList);

      for (let i = 0; i < dtos.length; i++) {
        dtos[i].quantityRooms = await this.roomRepository.count({
          roomblock: { id: dtos[i].id },
        });
        dtos[i].emptyRooms = await this.roomRepository.count({
          roomblock: { id: dtos[i].id },
          status: RoomStatus.EMPTY,
        });
      }

      return dtos;
    } catch (error) {
      this.logger.error(
        'Calling getRoomBlockList()',
        error,
        ModRoomBlocksService.name,
      );
      throw error;
    }
  }

  async getRoomsByIdBlockRoom(
    idBlockRoom: number,
    keyword: string,
    idUser: number,
  ) {
    try {
      const roomBlock = await this.roomBlockRepository.count({
        id: idBlockRoom,
        landlord: { id: idUser },
      });

      if (!roomBlock) {
        throw new BadRequestException(
          `Not found RoomBlock ID = [${idBlockRoom}]`,
        );
      }
      if (!keyword) keyword = '';
      const likeQr = { $like: `%${keyword}%` };
      const queryObj = {
        $or: [
          { roomName: likeQr },
          { area: likeQr },
          { price: likeQr },
          { depositAmount: likeQr },
          { utilities: likeQr },
        ],
      };
      const roomsEntity = await this.em.find(Room, {
        $and: [
          queryObj,
          { roomblock: { id: idBlockRoom, landlord: { id: idUser } } },
        ],
      });
      const roomsDto = plainToClass(ViewRoomDTO, roomsEntity);
      return roomsDto;
    } catch (error) {
      this.logger.error(
        'Calling getRoomsByIdBlockRoom()',
        error,
        ModRoomBlocksService.name,
      );
      throw error;
    }
  }
}
