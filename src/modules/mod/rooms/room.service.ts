import { EntityManager, EntityRepository, Loaded, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Room, RoomBlock } from 'src/entities';
import { Utility } from 'src/entities/utility.entity';
import { AddRoomModDTO } from './dto/add-rooms.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ViewRoomDTO } from './dto/view-room.dto';
import { UpdateRoomModDTO } from './dto/update-room.dto';
import { AWSService } from 'src/modules/aws/aws.service';
import { Role, RoomStatus } from 'src/common/enum/common.enum';

@Injectable()
export class ModRoomsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Utility)
    private readonly utilityRepository: EntityRepository<Utility>,
    @InjectRepository(RoomBlock)
    private readonly roomBlockRepository: EntityRepository<RoomBlock>,
    @InjectRepository(Room)
    private readonly roomRepository: EntityRepository<Room>,
    private readonly em: EntityManager,
    private readonly awsService: AWSService,
  ) {}

  async addRooms(addRoomDTO: AddRoomModDTO, idUser: number) {
    try {
      const roomBlockEntity: Loaded<RoomBlock> =
        await this.roomBlockRepository.findOne({
          id: addRoomDTO.roomBlockId,
          landlord: { id: idUser },
        });
      if (!roomBlockEntity) {
        throw new BadRequestException(
          `Can not find room block with id=[${addRoomDTO.roomBlockId}]`,
        );
      }
      const setIdRoom = new Set();
      for (const room of addRoomDTO.rooms) {
        const roomEntityById = await this.roomRepository.findOne({
          id: room.images[0].split('/')[4],
        });

        if (roomEntityById) {
          throw new HttpException(
            `The room with ID=[${room.images[0].split('/')[4]}] already exists`,
            HttpStatus.CONFLICT,
          );
        }
        setIdRoom.add(room.images[0].split('/')[4]);
        const utilityCount = await this.utilityRepository.count({
          id: {
            $in: room.utilities,
          },
        });

        if (utilityCount != room.utilities.length) {
          throw new BadRequestException(
            `There is a utility not found in system`,
          );
        }
      }

      if (setIdRoom.size != addRoomDTO.rooms.length) {
        throw new HttpException(
          'The two rooms cannot have the same photo link',
          HttpStatus.CONFLICT,
        );
      }

      const roomEntities = [];
      addRoomDTO.rooms.forEach(async (room, index) => {
        if (!room.roomName) {
          if (index < 10) room.roomName = `R00${index + 1}`;
          else room.roomName = `R0${index + 1}`;
        }
        const roomEntity = plainToInstance(Room, room);
        roomEntity.utilities = JSON.stringify(room.utilities);
        roomEntity.roomblock = roomBlockEntity;
        roomEntity.created_id = idUser;
        roomEntity.updated_id = idUser;
        roomEntity.images = JSON.stringify(room.images);
        roomEntity.status = RoomStatus.EMPTY;
        roomEntity.id = room.images[0].split('/')[4];

        roomEntities.push(roomEntity);
      });
      await this.em.persistAndFlush(roomEntities);
    } catch (error) {
      this.logger.error('Calling addRooms()', error, ModRoomsService.name);
      throw error;
    }
  }

  async updateRoom(
    idRoom: string,
    idlogin: number,
    updateRoomModDto: UpdateRoomModDTO,
  ) {
    try {
      const roomEntity: Loaded<Room> = await this.roomRepository.findOne({
        id: idRoom,
        roomblock: { landlord: idlogin },
      });

      if (!roomEntity) {
        throw new BadRequestException(`Can not find room with id: ${idRoom}`);
      }

      if (updateRoomModDto.utilities) {
        roomEntity.utilities = JSON.stringify(updateRoomModDto.utilities);
      }

      if (updateRoomModDto.idRoomBlock) {
        const roomBlockEntity: Loaded<RoomBlock> =
          await this.roomBlockRepository.findOne({
            id: updateRoomModDto.idRoomBlock,
          });

        if (!roomEntity) {
          throw new BadRequestException(
            `Can not find room with id: ${updateRoomModDto.idRoomBlock}`,
          );
        }
        roomEntity.roomblock = roomBlockEntity;
      }

      if (updateRoomModDto.images) {
        if (updateRoomModDto.images[0].split('/')[4] !== idRoom) {
          throw new BadRequestException('The photo must be in folder of room');
        }

        const urls = JSON.parse(roomEntity.images);
        await this.awsService.bulkDeleteObjects(urls);

        roomEntity.images = JSON.stringify(updateRoomModDto.images);
      }

      const { images, utilities, ...updated } = updateRoomModDto;

      wrap(roomEntity).assign(
        {
          ...updated,
          updated_at: new Date(),
          updated_id: idlogin,
        },
        { updateByPrimaryKey: false },
      );

      await this.em.persistAndFlush(roomEntity);
    } catch (error) {
      this.logger.error('Calling updateRoom()', error, ModRoomsService.name);
      throw error;
    }
  }

  async findRoomById(id: string, user: any) {
    try {
      const queryObj = {
        id,
      };
      if (user.role === Role.MOD) {
        queryObj['roomBlock'] = {
          landlord: { id: user.id },
        };
      }
      const roomEntity = await this.roomRepository.findOne(queryObj);
      if (!roomEntity) {
        // throw new BadRequestException(`Can not find room with id=[${id}]`);
        return null;
      }
      const roomDto = plainToInstance(ViewRoomDTO, roomEntity);
      return roomDto;
    } catch (error) {
      this.logger.error('Calling findRoomById()', error, ModRoomsService.name);
      throw error;
    }
  }

  async findAllRoom(id: number, keyword: string) {
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
        $and: [queryObj, { roomblock: { landlord: id } }],
      });
      const roomsDto = plainToClass(ViewRoomDTO, roomsEntity);
      return roomsDto;
    } catch (error) {
      this.logger.error('Calling findRoomById()', error, ModRoomsService.name);
      throw error;
    }
  }

  async deleteRoomById(id: string, idUser: number) {
    try {
      const roomEntity = await this.roomRepository.findOne({
        id,
        roomblock: { landlord: { id: idUser } },
      });

      if (!roomEntity) {
        throw new BadRequestException(`Can not find room with id=[${id}]`);
      }
      roomEntity.deleted_at = new Date();

      await this.em.persistAndFlush(roomEntity);
    } catch (error) {
      this.logger.error(
        'Calling deleteRoomById()',
        error,
        ModRoomsService.name,
      );
      throw error;
    }
  }
}
