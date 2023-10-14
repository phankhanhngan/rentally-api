import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AddRoomBlockAdminDTO } from './dtos/add-room-block-admin.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EntityManager, EntityRepository, PopulateHint } from '@mikro-orm/core';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UpdateRoomBlockAdminDTO } from './dtos/update-room-block-admin.dto';
import { RoomBlock, User } from 'src/entities';
import { RoomBlockAdminDTO } from './dtos/room-block.dto';

@Injectable()
export class RoomBlocksService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(RoomBlock)
    private readonly roomBlockRepository: EntityRepository<RoomBlock>,
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

      roomBlockEntity.addressLine1 = dto.addressLine1;
      roomBlockEntity.addressLine2 = dto.addressLine2;
      roomBlockEntity.city = dto.city;
      roomBlockEntity.state = dto.state;
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
      if ((await this.roomBlockRepository.count({ id })) < 1) {
        throw new BadRequestException(
          `Can not find room block with id=[${id}]`,
        );
      }
      await this.em.removeAndFlush(this.em.getReference(RoomBlock, id));
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
      const { landlord } = roomBlockEntity;
      const roomBlockDto = plainToInstance(RoomBlockAdminDTO, roomBlockEntity);
      roomBlockDto.landlord = {
        id: landlord.id,
        name: `${landlord.firstName} ${landlord.lastName}`,
        phoneNumber: landlord.phoneNumber,
        photo: landlord.photo,
      };
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
          { addressLine1: likeQr },
          { addressLine2: likeQr },
          { city: likeQr },
          { state: likeQr },
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

      const roomBlockDtoList = roomBlockEntityList.map((el) => {
        const dto = plainToInstance(RoomBlockAdminDTO, el);
        dto.landlord = {
          id: el.id,
          name: `${el.landlord.firstName} ${el.landlord.lastName}`,
          phoneNumber: el.landlord.phoneNumber,
          photo: el.landlord.photo,
        };
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
}
