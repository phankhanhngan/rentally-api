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
import { User, RoomBlock } from 'src/entities';
import { AddRoomBlockModDTO } from './dtos/add-room-block.dto';
import { UpdateRoomBlockModDTO } from './dtos/update-room-block-admin.dto';
import { RoomBlockModDTO } from './dtos/room-block.dto';

@Injectable()
export class ModRoomBlocksService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(RoomBlock)
    private readonly roomBlockRepository: EntityRepository<RoomBlock>,
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
        ModRoomBlocksService.name,
      );
      throw error;
    }
  }

  async getRoomBlock(id: number): Promise<RoomBlockModDTO> {
    try {
      const roomBlockEntity = await this.roomBlockRepository.findOne({ id });
      if (!roomBlockEntity) {
        throw new BadRequestException(
          `Can not find room block with id=[${id}]`,
        );
      }
      const roomBlockDto = plainToInstance(RoomBlockModDTO, roomBlockEntity);

      return roomBlockDto;
    } catch (error) {
      this.logger.error(
        'Calling deleteRoomBlock()',
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
          { addressLine1: likeQr },
          { addressLine2: likeQr },
          { city: likeQr },
          { state: likeQr },
          { country: likeQr },
          { description: likeQr },
        ],
      };
      const roomBlockEntityList = await this.roomBlockRepository.find(
        {
          $and: [queryObj, { landlord: {id: idUser} }],
        },
        {
          populate: ['landlord'],
          populateWhere: PopulateHint.INFER,
        },
      );

      const dtos = plainToClass(RoomBlockModDTO, roomBlockEntityList);

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
}
