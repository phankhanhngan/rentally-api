import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, utilities } from 'nest-winston';
import { FindRoomDTO } from './dtos/find-room.dto';
import { ro, th } from '@faker-js/faker';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Room, RoomBlock } from 'src/entities';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ViewFindRoomDTO } from './dtos/view-find-room';
import { RoomStatus } from 'src/common/enum/common.enum';
import { RoomDetailDTO } from './dtos/room-detail.dto';

@Injectable()
export class FindingService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Room)
    private readonly roomRepository: EntityRepository<Room>,
    @InjectRepository(RoomBlock)
    private readonly roomBlockRepository: EntityRepository<RoomBlock>,
  ) {}

  async findAllRoom(findRoomDto: FindRoomDTO) {
    try {
      let keyword = '';
      if (findRoomDto.district) keyword = findRoomDto.keyword.replace(' ', '%');
      const likeQr = { $like: `%${keyword}%` };
      const queryObjBlockRoom = {};
      queryObjBlockRoom['$and'] = [
        { $or: [{ city: likeQr }, { district: likeQr }, { address: likeQr }] },
      ];
      if (findRoomDto.city) {
        queryObjBlockRoom['$and'] = [
          ...queryObjBlockRoom['$and'],
          { city: findRoomDto.city },
        ];
      }
      if (findRoomDto.district) {
        queryObjBlockRoom['$and'] = [
          ...queryObjBlockRoom['$and'],
          { district: findRoomDto.district },
        ];
      }

      const queryObjUitilities = {};
      if (findRoomDto.utilities) {
        findRoomDto.utilities.forEach((utilitty, index) => {
          if (index == 0) {
            queryObjUitilities['$and'] = [
              { utilities: { $like: `%${utilitty}%` } },
            ];
          } else {
            queryObjUitilities['$and'] = [
              ...queryObjUitilities['$and'],
              { utilities: { $like: `%${utilitty}%` } },
            ];
          }
        });
      }

      let priceRangeQr = {};
      if (findRoomDto.maxPrice) {
        priceRangeQr = {
          price: { $gte: findRoomDto.minPrice, $lte: findRoomDto.maxPrice },
        };
      } else {
        priceRangeQr['price'] = { $gte: findRoomDto.minPrice };
      }

      const rooms = await this.roomRepository.find(
        {
          $and: [
            { roomblock: queryObjBlockRoom },
            queryObjUitilities,
            priceRangeQr,
            { status: RoomStatus.EMPTY },
          ],
        },
        {
          populate: ['roomblock'],
        },
      );
      const roomsDto = plainToClass(ViewFindRoomDTO, rooms);

      rooms.forEach((room, index) => {
        roomsDto[index].address = room.roomblock.address;
        roomsDto[index].district = room.roomblock.district;
        roomsDto[index].rating = 4.1;
      });

      // Get rating for ratingService
      // Get link utilities
      

      return roomsDto;
    } catch (err) {
      this.logger.error('Calling findAllRoom()', err, FindingService.name);
      throw err;
    }
  }

  async getRoomDetailById(id: string) {
    try {
      const room = await this.roomRepository.findOne(
        {
          id,
          status: RoomStatus.EMPTY,
        },
        {
          populate: ['roomblock'],
          fields: [
            '*',
            'roomblock.description',
            'roomblock.coordinate',
            'roomblock.address',
            'roomblock.district',
            'roomblock.city',
            'roomblock.country',
          ],
        },
      );

      if (!room) {
        throw new BadRequestException(`Can not find room with id=[${id}]`);
      }

      const roomDto = plainToInstance(RoomDetailDTO, room);
      // roomDto.description = room.roomblock.description;
      // roomDto.coordinate = room.roomblock.coordinate;
      // roomDto.address = room.roomblock.address;
      // roomDto.district = room.roomblock.district;
      // roomDto.city = room.roomblock.city;
      // roomDto.country = room.roomblock.country;

      roomDto.rating = 4.5;
      roomDto.ratingNumber = 3;

      return roomDto;
    } catch (err) {
      this.logger.error(
        'Calling getRoomDetailById()',
        err,
        FindingService.name,
      );
      throw err;
    }
  }
}
