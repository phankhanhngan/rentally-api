import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AddRoomBlockAdminDTO } from './dtos/add-room-block-admin.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EntityManager, EntityRepository, PopulateHint } from '@mikro-orm/core';
import { plainToClass, plainToInstance } from 'class-transformer';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UpdateRoomBlockAdminDTO } from './dtos/update-room-block-admin.dto';
import { Room, RoomBlock, User } from 'src/entities';
import { RoomBlockAdminDTO } from './dtos/room-block.dto';
import { ViewRoomDTO } from '../rooms/dtos/view-room.dto';
import { RoomStatus } from 'src/common/enum/common.enum';
import { GetUserDTO } from 'src/modules/users/dtos/get-user.dto';

@Injectable()
export class RoomBlocksService {
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

  async addRoomBlock(user: User, dto: AddRoomBlockAdminDTO) {
    try {
      const { landlordId } = dto;
      if ((await this.userRepository.count({ id: landlordId })) < 1) {
        throw new BadRequestException(
          `Can not find landlord with id=[${landlordId}]`,
        );
      }
      const roomBlockEntity = plainToInstance(RoomBlock, dto);
      roomBlockEntity.created_id = user.id;
      roomBlockEntity.updated_id = user.id;
      roomBlockEntity.landlord = this.em.getReference(User, landlordId);
      await this.em.persistAndFlush(roomBlockEntity);
    } catch (error) {
      this.logger.error(
        'Calling addRoomBlock()',
        error,
        RoomBlocksService.name,
      );
      throw error;
    }
  }

  async updateRoomBlock(user: User, id: number, dto: UpdateRoomBlockAdminDTO) {
    try {
      const roomBlockEntity: RoomBlock = await this.roomBlockRepository.findOne(
        { id },
      );
      if (!roomBlockEntity) {
        throw new BadRequestException(
          `Can not find room block with id=[${id}]`,
        );
      }

      roomBlockEntity.address = dto.address;
      roomBlockEntity.city = dto.city;
      roomBlockEntity.district = dto.district;
      roomBlockEntity.country = dto.country;
      roomBlockEntity.coordinate = dto.coordinate;
      roomBlockEntity.description = dto.description;
      roomBlockEntity.landlord = this.em.getReference(User, dto.landlordId);
      roomBlockEntity.updated_id = user.id;

      await this.em.persistAndFlush(roomBlockEntity);
    } catch (error) {
      this.logger.error(
        'Calling updateRoomBlock()',
        error,
        RoomBlocksService.name,
      );
      throw error;
    }
  }

  async deleteRoomBlock(id: number) {
    try {
      const roomBlock = await this.roomBlockRepository.findOne({ id });
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
        RoomBlocksService.name,
      );
      throw error;
    }
  }

  async getRoomBlock(id: number): Promise<RoomBlockAdminDTO> {
    try {
      const roomBlockEntity = await this.roomBlockRepository.findOne(
        { id },
        {
          populate: ['landlord'],
        },
      );
      if (!roomBlockEntity) {
        throw new BadRequestException(
          `Can not find room block with id=[${id}]`,
        );
      }
      const roomBlockDto = plainToInstance(RoomBlockAdminDTO, roomBlockEntity);
      roomBlockDto.landlord = plainToInstance(
        GetUserDTO,
        roomBlockEntity.landlord,
      );

      roomBlockDto['quantityRooms'] = await this.roomRepository.count({
        roomblock: this.em.getReference(RoomBlock, roomBlockDto.id),
      });
      roomBlockDto['emptyRooms'] = await this.roomRepository.count({
        roomblock: this.em.getReference(RoomBlock, roomBlockDto.id),
        status: RoomStatus.EMPTY,
      });
      return roomBlockDto;
    } catch (error) {
      this.logger.error(
        'Calling deleteRoomBlock()',
        error,
        RoomBlocksService.name,
      );
      throw error;
    }
  }

  async getRoomBlockList(keyword: string) {
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
        queryObj,
        {
          populate: ['landlord'],
          populateWhere: PopulateHint.INFER,
        },
      );

      const roomQuantity = new Map();
      await Promise.all(
        roomBlockEntityList.map(async (el) => {
          const quantity = await this.roomRepository.count({
            roomblock: this.em.getReference(RoomBlock, el.id),
          });
          const emptyQuantity = await this.roomRepository.count({
            roomblock: this.em.getReference(RoomBlock, el.id),
            status: RoomStatus.EMPTY,
          });
          roomQuantity.set(el.id, [quantity, emptyQuantity]);
        }),
      );

      const roomBlockDtoList = roomBlockEntityList.map((el) => {
        const dto = plainToInstance(RoomBlockAdminDTO, el);
        dto.landlord = {
          id: el.landlord.id,
          phoneNumber: el.landlord.phoneNumber,
          deletedAt: el.landlord.deleted_at,
          name: el.landlord.firstName + el.landlord.lastName,
        };
        dto['quantityRooms'] = roomQuantity.get(el.id)[0];
        dto['emptyRooms'] = roomQuantity.get(el.id)[1];
        return dto;
      });
      return roomBlockDtoList;
    } catch (error) {
      this.logger.error(
        'Calling getRoomBlockList()',
        error,
        RoomBlocksService.name,
      );
      throw error;
    }
  }

  async getRoomsByIdBlockRoom(idBlockRoom: number, keyword: string) {
    try {
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
        $and: [queryObj, { roomblock: { id: idBlockRoom } }],
      });
      const roomsDto = plainToClass(ViewRoomDTO, roomsEntity);
      return roomsDto;
    } catch (error) {
      this.logger.error(
        'Calling getRoomsByIdBlockRoom()',
        error,
        RoomBlocksService.name,
      );
      throw error;
    }
  }
}
