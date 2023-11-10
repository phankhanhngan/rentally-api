import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { FindRoomDTO } from './dtos/find-room.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Room, User } from 'src/entities';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ViewFindRoomDTO } from './dtos/view-find-room';
import { RoomStatus } from 'src/common/enum/common.enum';
import { RoomDetailDTO } from './dtos/room-detail.dto';
import { RatingService } from '../rating/rating.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { Rental } from 'src/entities/rental.entity';
import { LandLordDTO } from './dtos/landlord.dto';
import { ProvinceService } from '../province/province.service';
import { Province } from 'src/entities/province.entity';
import { District } from 'src/entities/district.entity';

@Injectable()
export class FindingService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Room)
    private readonly roomRepository: EntityRepository<Room>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Rental)
    private readonly rentalRepository: EntityRepository<Rental>,
    @InjectRepository(Province)
    private readonly provinceRepository: EntityRepository<Province>,
    @InjectRepository(District)
    private readonly districtRepository: EntityRepository<District>,
    private readonly utilitiesService: UtilitiesService,
    private readonly ratingService: RatingService,
  ) {}

  async findAllRoom(findRoomDto: FindRoomDTO) {
    try {
      if (findRoomDto.district && !findRoomDto.province) return null;

      let keyword = '';
      if (findRoomDto.keyword)
        keyword = findRoomDto.keyword.replaceAll(' ', '%');
      const likeQr = { $like: `%${keyword}%` };
      const queryObjBlockRoom = {};
      queryObjBlockRoom['$and'] = [
        { $or: [{ city: likeQr }, { district: likeQr }, { address: likeQr }] },
      ];

      if (findRoomDto.district) {
        const province = await this.provinceRepository.findOne({
          code: findRoomDto.province,
        });
        if (!province) {
          throw new BadRequestException(
            `Can not find province with code=[${findRoomDto.province}]`,
          );
        }
        const district = await this.districtRepository.findOne({
          code: findRoomDto.district,
        });
        if (!district) {
          throw new BadRequestException(
            `Can not find district with code=[${findRoomDto.district}]`,
          );
        }

        queryObjBlockRoom['$and'] = [
          ...queryObjBlockRoom['$and'],
          { district: district.name },
          { city: province.name },
        ];
      }

      if (findRoomDto.province && !findRoomDto.district) {
        const province = await this.provinceRepository.findOne({
          code: findRoomDto.province,
        });
        if (!province) {
          throw new BadRequestException(
            `Can not find province with code=[${findRoomDto.province}]`,
          );
        }

        queryObjBlockRoom['$and'] = [
          ...queryObjBlockRoom['$and'],
          { city: province.name },
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
      console.log(queryObjBlockRoom);

      const roomsDto = plainToClass(ViewFindRoomDTO, rooms);

      for (let i = 0; i < rooms.length; i++) {
        roomsDto[i].address = rooms[i].roomblock.address;
        roomsDto[i].district = rooms[i].roomblock.district;
        roomsDto[i].coordinate = rooms[i].roomblock.coordinate;

        // const rental = await this.rentalRepository.findOne(
        //   {
        //     room: { id: rooms[i].id },
        //   },
        //   {
        //     populate: ['rentalDetail'],
        //     orderBy: { rentalDetail: { moveOutDate: -1 } },
        //   },
        // );
        // if (rooms[i].status === RoomStatus.OCCUPIED) {
        //   roomsDto[i].move_out_date = rental.rentalDetail.moveOutDate;
        // } else {
        //   roomsDto[i].move_out_date = null;
        // }

        const utilities = JSON.parse(rooms[i].utilities);
        const utilitiesDetail = [];
        for (let j = 0; j < utilities.length; j++) {
          const utilityDto = await this.utilitiesService.getUtilityById(
            utilities[j],
          );
          utilitiesDetail.push(utilityDto);
        }
        roomsDto[i].utilities = utilitiesDetail;

        const rating = await this.ratingService.findByRoom(rooms[i].id);
        if (rating.ratings) roomsDto[i].avgRate = rating.avgRate;
      }

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
        // throw new BadRequestException(`Can not find room with id=[${id}]`);
        return null;
      }
      const landlord = await this.userRepository.findOne({
        id: room.roomblock.id,
      });
      const landlordDto = plainToInstance(LandLordDTO, landlord);
      landlordDto.name = landlord.firstName;
      if (landlord.lastName) landlordDto.name += ' ' + landlord.lastName;

      const roomDto = plainToInstance(RoomDetailDTO, room);
      roomDto.landlord = landlordDto;

      const rating = await this.ratingService.findByRoom(room.id);
      if (rating.ratings) {
        roomDto.ratingDetail = rating;
      }

      const utilities = JSON.parse(room.utilities);
      const utilitiesDetail = [];
      for (let j = 0; j < utilities.length; j++) {
        const utilityDto = await this.utilitiesService.getUtilityById(
          utilities[j],
        );
        utilitiesDetail.push(utilityDto);
      }
      roomDto.utilities = utilitiesDetail;

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

  async getPrice() {
    try {
      const maxPrice = await this.roomRepository.findAll({
        orderBy: { price: -1 },
        limit: 1,
      });

      const minPrice = await this.roomRepository.findAll({
        orderBy: { price: 1 },
        limit: 1,
      });

      return {
        maxPrice: maxPrice[0].price,
        minPrice: minPrice[0].price,
      };
    } catch (error) {
      this.logger.error('Calling getPrice()', error, FindingService.name);
      throw error;
    }
  }
}
