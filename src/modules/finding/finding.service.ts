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
import { LandLordDTO } from './dtos/landlord.dto';
import { Province } from 'src/entities/province.entity';
import { District } from 'src/entities/district.entity';
import Decimal from 'decimal.js';
import { Checklist } from 'src/entities/checklist.entity';

@Injectable()
export class FindingService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Room)
    private readonly roomRepository: EntityRepository<Room>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Checklist)
    private readonly checklistRepository: EntityRepository<Checklist>,
    @InjectRepository(Province)
    private readonly provinceRepository: EntityRepository<Province>,
    @InjectRepository(District)
    private readonly districtRepository: EntityRepository<District>,
    private readonly utilitiesService: UtilitiesService,
    private readonly ratingService: RatingService,
  ) {}

  async findAllRoom(findRoomDto: FindRoomDTO, loginId: number) {
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
          { district: district.full_name },
          { city: province.full_name },
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
          { city: province.full_name },
        ];
      }

      const queryObjUitilities = {};
      if (findRoomDto.utilities) {
        findRoomDto.utilities.forEach((utilitty, index) => {
          if (index == 0) {
            queryObjUitilities['$and'] = [
              { utilities: { $re: `.*[\\[,]${utilitty}[,\\]].*` } },
            ];
          } else {
            queryObjUitilities['$and'] = [
              ...queryObjUitilities['$and'],
              { utilities: { $re: `.*[\\[,]${utilitty}[,\\]].*` } },
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

      const limit =
        findRoomDto.perPage && findRoomDto.perPage >= 1
          ? findRoomDto.perPage
          : 10;
      const offset = findRoomDto.page >= 1 ? limit * (findRoomDto.page - 1) : 0;
      const rooms = await this.roomRepository.find(
        {
          $and: [
            { roomblock: queryObjBlockRoom },
            queryObjUitilities,
            priceRangeQr,
            { status: RoomStatus.EMPTY },
            { deleted_at: null },
          ],
        },
        {
          populate: ['roomblock'],
          limit,
          offset,
        },
      );

      const total = await this.roomRepository.count({
        $and: [
          { roomblock: queryObjBlockRoom },
          queryObjUitilities,
          priceRangeQr,
          { status: RoomStatus.EMPTY },
        ],
      });
      const numberOfPage = new Decimal(total).div(limit).ceil().d[0];
      const roomsDto = plainToClass(ViewFindRoomDTO, rooms);

      for (let i = 0; i < rooms.length; i++) {
        roomsDto[i].address = rooms[i].roomblock.address;
        roomsDto[i].district = rooms[i].roomblock.district;
        roomsDto[i].coordinate = rooms[i].roomblock.coordinate;

        const checklist = await this.checklistRepository.findOne({
          room: { id: rooms[i].id },
          renter: { id: loginId },
        });
        roomsDto[i].isInCheckList = checklist ? true : false;

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
      const currentPage = Number(findRoomDto.page >= 1 ? findRoomDto.page : 1);
      return { roomsDto, numberOfPage, currentPage, totalRoom: total };
    } catch (err) {
      this.logger.error('Calling findAllRoom()', err, FindingService.name);
      throw err;
    }
  }

  async getRoomDetailById(id: string, loginId: number) {
    try {
      const room = await this.roomRepository.findOne(
        { id, deleted_at: null },
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
            'roomblock.landlord',
          ],
        },
      );

      if (!room) {
        // throw new BadRequestException(`Can not find room with id=[${id}]`);
        return null;
      }
      const [landlord, rating, isInCheckList] = await Promise.all([
        this.userRepository.findOne({
          id: room.roomblock.landlord.id,
        }),
        this.ratingService.findByRoom(room.id),
        this.checklistRepository.findOne({
          room: { id: id },
          renter: { id: loginId },
        }),
      ]);

      const landlordDto = plainToInstance(LandLordDTO, landlord);
      landlordDto.name = landlord.firstName;
      if (landlord.lastName) landlordDto.name += ' ' + landlord.lastName;

      const roomDto = plainToInstance(RoomDetailDTO, room, {
        excludePrefixes: ['landlord'],
      });
      roomDto.landlord = landlordDto;

      if (rating.ratings) {
        roomDto.ratingDetail = rating;
      } else {
        roomDto.ratingDetail = {
          ratings: [],
          totalRating: 0,
        };
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
      roomDto.isInCheckList = isInCheckList ? true : false;

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
