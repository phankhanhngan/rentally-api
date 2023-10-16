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

@Injectable()
export class ModRoomsService {
  awsService: any;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Utility)
    private readonly utilityRepository: EntityRepository<Utility>,
    @InjectRepository(RoomBlock)
    private readonly roomBlockRepository: EntityRepository<RoomBlock>,
    @InjectRepository(Room)
    private readonly roomRepository: EntityRepository<Room>,
    private readonly em: EntityManager,
  ) {}

  async addRooms(
    addRoomDTO: AddRoomModDTO,
    idUser: number,
    files: Array<Express.Multer.File> | Express.Multer.File,
  ) {
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
      for (
        let indexRoom = 0;
        indexRoom < addRoomDTO.rooms.length;
        indexRoom++
      ) {
        const room = addRoomDTO.rooms[indexRoom];
        for (let i = 0; i < room.utilities.length; i++) {
          const utilityId = room.utilities[i];
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

      for (
        let indexRoom = 0;
        indexRoom < addRoomDTO.rooms.length;
        indexRoom++
      ) {
        const utilities = [];
        const room = addRoomDTO.rooms[indexRoom];
        for (let i = 0; i < room.utilities.length; i++) {
          const utilityId = room.utilities[i];
          const utility = await this.utilityRepository.findOne(
            { id: utilityId },
            { fields: ['name', 'note'] },
          );

          const { name, note } = utility;
          utilities.push({ name, note });
        }
        if (!room.roomName) {
          if (indexRoom < 10) room.roomName = `R00${indexRoom}`;
          else room.roomName = `R0${indexRoom}`;
        }
        const roomEntity = await plainToInstance(Room, room);
        roomEntity.utilities = await JSON.stringify(utilities);
        roomEntity.roomblock = roomBlockEntity;
        roomEntity.created_id = idUser;
        roomEntity.updated_id = idUser;

        // if (files) {
        //   const currentDate = new Date();
        //   const timestamp = currentDate.getTime();
        //   const urlImages: string[] = await this.awsService.bulkPutObject(
        //     `RoomImages/${timestamp}`,
        //     files,
        //   );
        // }

        roomEntity.images = "";        
        await this.em.persistAndFlush(roomEntity);
      }
    } catch (error) {
      this.logger.error('Calling addRooms()', error, ModRoomsService.name);
      throw error;
    }
  }

  async updateRoom(
    idRoom: number,
    idlogin: number,
    updateRoomModDto: UpdateRoomModDTO,
    files: Express.Multer.File[] | Express.Multer.File[],
  ) {
    try {
      const roomEntity: Loaded<Room> = await this.roomRepository.findOne({
        id: idRoom,
      });

      if (!roomEntity) {
        throw new BadRequestException(`Can not find room with id: ${idRoom}`);
      }

      if (updateRoomModDto.utilitiesArray) {
        for (let i = 0; i < updateRoomModDto.utilitiesArray.length; i++) {
          const utilityId = updateRoomModDto.utilitiesArray[i];
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

      if (updateRoomModDto.utilitiesArray) {
        const utilities = [];
        for (let i = 0; i < updateRoomModDto.utilitiesArray.length; i++) {
          const utilityId = updateRoomModDto.utilitiesArray[i];
          const utility = await this.utilityRepository.findOne(
            { id: utilityId },
            { fields: ['name', 'note'] },
          );

          const { name, note } = utility;
          utilities.push({ name, note });
        }
        roomEntity.utilities = JSON.stringify(utilities);
      }

      if (updateRoomModDto.files) {
        roomEntity.images = JSON.stringify(updateRoomModDto.files);
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

      if (files) {
        console.log(JSON.parse(roomEntity.images));
        
        await this.awsService.bulkDeleteObjects(JSON.parse(roomEntity.images));

        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const urlImages: string[] = await this.awsService.bulkPutObject(
          `RoomImages/${timestamp}`,
          files,
        );
        roomEntity.images = JSON.stringify(urlImages);
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

  async findRoomById(id: number) {
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
}
