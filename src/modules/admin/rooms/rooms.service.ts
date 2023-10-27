import { EntityManager, EntityRepository, Loaded, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Room, RoomBlock, User } from 'src/entities';
import { AddRoomAdminDTO } from './dtos/add-room-admin.dto';
import { Utility } from 'src/entities/utility.entity';
import { plainToInstance } from 'class-transformer';
import { RoomStatus } from 'src/common/enum/common.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UpdateRoomAdminDTO } from './dtos/update-room-admin.dto';
import { AWSService } from 'src/modules/aws/aws.service';
import { ViewRoomDTO } from './dtos/view-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: EntityRepository<Room>,
    @InjectRepository(RoomBlock)
    private readonly roomBlockRepository: EntityRepository<RoomBlock>,
    @InjectRepository(Utility)
    private readonly utilityRepository: EntityRepository<Utility>,
    private readonly em: EntityManager,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly awsService: AWSService,
  ) {}

  async addRoom(addRoomDTO: AddRoomAdminDTO, user: User) {
    try {
      const imageSet = new Set();
      addRoomDTO.images.forEach((el) => {
        imageSet.add(el);
      });

      if (imageSet.size < addRoomDTO.images.length) {
        throw new HttpException(
          'The two rooms cannot have the same photo link',
          HttpStatus.CONFLICT,
        );
      }

      const roomBlockEntity: Loaded<RoomBlock> =
        await this.roomBlockRepository.findOne({
          id: addRoomDTO.roomBlockId,
        });

      if (!roomBlockEntity) {
        throw new BadRequestException(
          `Can not find room block with id=[${addRoomDTO.roomBlockId}]`,
        );
      }

      const utilityCount = await this.utilityRepository.count({
        id: {
          $in: addRoomDTO.utilities,
        },
      });

      if (utilityCount != addRoomDTO.utilities.length) {
        throw new BadRequestException(`There is a utility not found in system`);
      }

      const roomEntityById = await this.roomRepository.findOne({
        id: addRoomDTO.images[0].split('/')[4],
      });

      if (roomEntityById) {
        throw new HttpException(
          `The room with ID=[${
            addRoomDTO.images[0].split('/')[4]
          }] already exists`,
          HttpStatus.CONFLICT,
        );
      }

      const roomEntity = plainToInstance(Room, addRoomDTO);
      roomEntity.utilities = JSON.stringify(addRoomDTO.utilities);
      roomEntity.roomblock = roomBlockEntity;
      roomEntity.created_id = user.id;
      roomEntity.updated_id = user.id;
      roomEntity.images = JSON.stringify(addRoomDTO.images);
      roomEntity.status = RoomStatus.EMPTY;
      roomEntity.id = addRoomDTO.images[0].split('/')[4];

      await this.em.persistAndFlush(roomEntity);
    } catch (error) {
      this.logger.error('Calling addRooms()', error, RoomsService.name);
      throw error;
    }
  }

  async updateRoom(
    id: string,
    updateRoomBlockDto: UpdateRoomAdminDTO,
    user: User,
  ) {
    try {
      const roomEntity: Loaded<Room> = await this.roomRepository.findOne({
        id: id,
      });

      if (!roomEntity) {
        throw new BadRequestException(`Can not find room with id: ${id}`);
      }

      const utilityCount = await this.utilityRepository.count({
        id: {
          $in: updateRoomBlockDto.utilities,
        },
      });

      if (utilityCount != updateRoomBlockDto.utilities.length) {
        throw new BadRequestException(`There is a utility not found in system`);
      }

      const urls = JSON.parse(roomEntity.images);
      await this.awsService.bulkDeleteObjects(urls);
      roomEntity.images = JSON.stringify(updateRoomBlockDto.images);
      roomEntity.utilities = JSON.stringify(updateRoomBlockDto.utilities);
      const { images, utilities, ...updated } = updateRoomBlockDto;

      wrap(roomEntity).assign(
        {
          ...updated,
          updated_at: new Date(),
          updated_id: user.id,
        },
        { updateByPrimaryKey: false },
      );

      await this.em.persistAndFlush(roomEntity);
    } catch (error) {
      this.logger.error('Calling updateRoom()', error, RoomsService.name);
      throw error;
    }
  }

  async findRoomById(id: string) {
    try {
      const roomEntity = await this.roomRepository.findOne({ id });
      if (!roomEntity) {
        throw new BadRequestException(`Can not find room with id=[${id}]`);
      }
      const roomDto = plainToInstance(ViewRoomDTO, roomEntity);
      return {
        room: roomDto,
        roomBlockId: roomEntity.roomblock,
      };
    } catch (error) {
      this.logger.error('Calling findRoomById()', error, RoomsService.name);
      throw error;
    }
  }

  async findAllRoom(keyword: string) {
    try {
      if (!keyword) keyword = '';
      const likeQr = { $like: `%${keyword}%` };
      const queryObj = {
        $or: [{ roomName: likeQr }],
      };
      const roomsEntity = await this.em.find(Room, queryObj);
      const roomsDto = plainToInstance(ViewRoomDTO, roomsEntity);
      return roomsDto;
    } catch (error) {
      this.logger.error('Calling findRoomById()', error, RoomsService.name);
      throw error;
    }
  }

  async deleteRoomById(id: string) {
    try {
      const roomEntity = await this.roomRepository.findOne({ id });

      if (!roomEntity) {
        throw new BadRequestException(`Can not find room with id=[${id}]`);
      }
      const urls = JSON.parse(roomEntity.images);
      await this.awsService.bulkDeleteObjects(urls);
      await this.em.removeAndFlush(this.roomRepository.getReference(id));
    } catch (error) {
      this.logger.error('Calling deleteRoomById()', error, RoomsService.name);
      throw error;
    }
  }
}
