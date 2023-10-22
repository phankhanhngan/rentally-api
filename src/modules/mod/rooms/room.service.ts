import { EntityManager, EntityRepository, Loaded, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
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
import { RoomStatus } from 'src/common/enum/common.enum';

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
        });
      if (!roomBlockEntity) {
        throw new BadRequestException(
          `Can not find room block with id=[${addRoomDTO.roomBlockId}]`,
        );
      }
      // Kiem tra loi khong tim thay utility
      const setIdRoom = new Set();
      for (
        let indexRoom = 0;
        indexRoom < addRoomDTO.rooms.length;
        indexRoom++
      ) {
        const room = addRoomDTO.rooms[indexRoom];

        const roomEntityById = await this.roomRepository.findOne({
          id: room.files[0].split('/')[4],
        });

        if (roomEntityById) {
          throw new BadRequestException(
            'The photo link already exists in another room',
          );
        }

        setIdRoom.add(room.files[0].split('/')[4]);
        for (let i = 0; i < room.utility.length; i++) {
          const utilityId = room.utility[i];
          const utility = await this.utilityRepository.findOne({
            id: utilityId,
          });
          if (!utility) {
            throw new BadRequestException(
              `Can not find utility with id=[${utilityId}] at room ${indexRoom}`,
            );
          }
        }
      }
      if (setIdRoom.size != addRoomDTO.rooms.length) {
        throw new BadRequestException(
          'The two rooms cannot have the same photo link',
        );
      }

      for (
        let indexRoom = 0;
        indexRoom < addRoomDTO.rooms.length;
        indexRoom++
      ) {
        const utilities = [];
        const room = addRoomDTO.rooms[indexRoom];
        for (let i = 0; i < room.utility.length; i++) {
          const utilityId = room.utility[i];
          const utility = await this.utilityRepository.findOne(
            { id: utilityId },
            { fields: ['name', 'note'] },
          );

          const { name, note } = utility;
          utilities.push({ name, note });
        }
        if (!room.roomName) {
          if (indexRoom < 10) room.roomName = `R00${indexRoom + 1}`;
          else room.roomName = `R0${indexRoom + 1}`;
        }
        const roomEntity = await plainToInstance(Room, room);
        roomEntity.utilities = await JSON.stringify(utilities);
        roomEntity.roomblock = roomBlockEntity;
        roomEntity.created_id = idUser;
        roomEntity.updated_id = idUser;
        roomEntity.images = JSON.stringify(room.files);
        roomEntity.status = RoomStatus.EMPTY;
        roomEntity.id = room.files[0].split('/')[4];

        await this.em.persistAndFlush(roomEntity);
      }
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
      });

      if (!roomEntity) {
        throw new BadRequestException(`Can not find room with id: ${idRoom}`);
      }

      if (updateRoomModDto.utility) {
        for (let i = 0; i < updateRoomModDto.utility.length; i++) {
          const utilityId = updateRoomModDto.utility[i];
          const utility = await this.utilityRepository.findOne({
            id: utilityId,
          });
          if (!utility) {
            throw new BadRequestException(
              `Can not find utility with id=[${utilityId}]`,
            );
          }
        }
      }

      if (updateRoomModDto.utility) {
        const utilities = [];
        for (let i = 0; i < updateRoomModDto.utility.length; i++) {
          const utilityId = updateRoomModDto.utility[i];
          const utility = await this.utilityRepository.findOne(
            { id: utilityId },
            { fields: ['name', 'note'] },
          );

          const { name, note } = utility;
          utilities.push({ name, note });
        }
        roomEntity.utilities = JSON.stringify(utilities);
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

      if (updateRoomModDto.files) {
        const roomEntityById = await this.roomRepository.findOne({
          id: updateRoomModDto.files[0].split('/')[4],
        });

        if (
          roomEntityById &&
          updateRoomModDto.files[0].split('/')[4] !== idRoom
        ) {
          throw new BadRequestException(
            'The photo link already exists in another room',
          );
        }

        const urls = JSON.parse(roomEntity.images);
        await this.awsService.bulkDeleteObjects(urls);

        roomEntity.images = JSON.stringify(updateRoomModDto.files);
      }

      wrap(roomEntity).assign(
        {
          ...updateRoomModDto,
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

  async findRoomById(id: string) {
    try {
      const roomEntity = await this.roomRepository.findOne({ id });
      if (!roomEntity) {
        throw new BadRequestException(`Can not find room with id=[${id}]`);
      }
      const roomDto = plainToInstance(ViewRoomDTO, roomEntity);
      return roomDto;
    } catch (error) {
      this.logger.error('Calling findRoomById()', error, ModRoomsService.name);
      throw error;
    }
  }

  async findAllRoom(id: number) {
    try {
      const roomsEntity = await this.em.find(Room, {
        roomblock: { landlord: id },
      });
      const roomsDto = plainToClass(ViewRoomDTO, roomsEntity);
      return roomsDto;
    } catch (error) {
      this.logger.error('Calling findRoomById()', error, ModRoomsService.name);
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
      this.logger.error(
        'Calling deleteRoomById()',
        error,
        ModRoomsService.name,
      );
      throw error;
    }
  }
}
