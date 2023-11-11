import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import {
  RatingStatus,
  RentalStatus,
  Role,
  RoomStatus,
} from 'src/common/enum/common.enum';
import { Rental } from 'src/entities/rental.entity';
import { MyRentalDTO } from './dtos/MyRental.dto';
import { RatingService } from '../rating/rating.service';
import { CreateRentalDTO } from './dtos/CreateRental.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Room, User } from 'src/entities';
import { RentalDetail } from 'src/entities/rental_detail.entity';
import { HostInfoDTO } from './dtos/HostInfo.dto';
import { UpdateRentalDTO } from './dtos/UpdateRental.dto';
import * as moment from 'moment';
import { UserRtnDto } from '../auth/dtos/UserRtnDto.dto';

@Injectable()
export class RentalService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(forwardRef(() => RatingService))
    private readonly ratingService: RatingService,
    private readonly em: EntityManager,
    @InjectRepository(Room)
    private readonly roomRepository: EntityRepository<Room>,
    @InjectRepository(RentalDetail)
    private readonly rentalDetailRepository: EntityRepository<RentalDetail>,
    @InjectRepository(Rental)
    private readonly rentalRepository: EntityRepository<Rental>,
  ) {}

  async findByIdAndRenter(
    rentalId: number,
    renterId: number,
    status: RentalStatus,
  ) {
    try {
      const queryObj = {
        $and: [
          {
            renter: {
              $and: [{ id: renterId }],
            },
          },
          {
            id: rentalId,
          },
          {
            status: RentalStatus.COMPLETED,
          },
        ],
      };
      const rental = await this.em.findOne(Rental, queryObj, {
        populate: ['renter', 'room', 'landlord'],
      });
      return rental;
    } catch (error) {
      this.logger.error(
        'Calling findByIdAndRenter()',
        error,
        RentalService.name,
      );
      throw error;
    }
  }

  async getMyRental(idLogined: any): Promise<MyRentalDTO[]> {
    try {
      const rentals = await this.em.find(
        Rental,
        { renter: { id: idLogined } },
        {
          populate: [
            'landlord',
            'renter',
            'room',
            'room.roomblock',
            'rentalDetail',
          ],
        },
      );
      const rentalsDTO: MyRentalDTO[] = [];
      if (rentals.length < 1) {
        return rentalsDTO;
      }
      for (const rental of rentals) {
        const dto = await this.setRentalDTO(rental);
        rentalsDTO.push(dto);
      }
      return rentalsDTO;
    } catch (error) {
      this.logger.error('Calling getMyRental()', error, RentalService.name);
      throw error;
    }
  }

  async create(createRentalDTO: CreateRentalDTO, user: any) {
    try {
      const room = await this.roomRepository.findOne(
        {
          id: createRentalDTO.roomId,
          deleted_at: null,
        },
        { populate: ['roomblock', 'roomblock.landlord'] },
      );

      if (!room) {
        throw new BadRequestException(
          `Cannot find room with id=[${createRentalDTO.roomId}]`,
        );
      }

      if (room.status != RoomStatus.EMPTY) {
        throw new BadRequestException(
          `Room with id=[${createRentalDTO.roomId}] was already rented by someone`,
        );
      }

      const landlord = this.em.getReference(User, room.roomblock.landlord.id);
      const renter = this.em.getReference(User, user.id);
      const moveInDate = moment(
        createRentalDTO.rentalInfo.moveInDate,
        'DD/MM/YYYY',
      ).toDate();
      const rentalDetail = {
        moveInDate: moveInDate,
        moveOutDate: new Date(
          moveInDate.setMonth(
            moveInDate.getMonth() + createRentalDTO.rentalInfo.leaseTerm,
          ),
        ),
        leaseTerm: createRentalDTO.rentalInfo.leaseTerm,
        renterIdentifyNo: createRentalDTO.tenantInfo.identityNumber,
        renterIdentifyDate: moment(
          createRentalDTO.tenantInfo.identityDateOfIssue,
          'DD/MM/YYYY',
        ).toDate(),
        renterIdentifyAddress: createRentalDTO.tenantInfo.identityPlaceOfIsse,
        renterBirthday: moment(
          createRentalDTO.tenantInfo.birthday,
          'DD/MM/YYYY',
        ).toDate(),
        monthlyRent: parseInt(room.price.toString()),
        created_id: user.id,
        updated_id: user.id,
      };

      const rentalDetailEntity =
        this.rentalDetailRepository.create(rentalDetail);
      this.em.persist(rentalDetailEntity);

      const rentalEntity: Rental = this.rentalRepository.create({
        landlord,
        renter,
        room,
        ratingStatus: RatingStatus.NONE,
        status: RentalStatus.CREATED,
        tenants: createRentalDTO.rentalInfo.numberOfTenants,
        rentalDetail: rentalDetailEntity,
        created_id: user.id,
        updated_id: user.id,
      });
      this.em.persist(rentalEntity);

      room.status = RoomStatus.OCCUPIED;
      this.em.persist(room);
      this.em.flush();
    } catch (err) {
      this.logger.error('Calling create()', err, RentalService.name);
      throw err;
    }
  }

  async modGetRentalById(id: number, user: any): Promise<MyRentalDTO> {
    try {
      const rental = await this.rentalRepository.findOne(
        {
          id,
          landlord: user,
        },
        {
          populate: [
            'landlord',
            'renter',
            'room',
            'room.roomblock',
            'rentalDetail',
          ],
        },
      );
      if (!rental) {
        throw new BadRequestException(`Cannot find rental with id=[${id}]`);
      }
      const dto = this.setRentalDTO(rental);
      return dto;
    } catch (err) {
      this.logger.error('Calling getRentalById()', err, RentalService.name);
      throw err;
    }
  }

  async getLatestModInfo(user: any): Promise<HostInfoDTO> {
    try {
      const rental = await this.rentalRepository.findOne(
        { landlord: user },
        {
          orderBy: {
            ['created_at']: 'DESC',
          },
          populate: ['rentalDetail'],
        },
      );
      return {
        id: user.id,
        firstName: user.firstName,
        lastname: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        identityNumber: rental.rentalDetail.landlordIdentifyNo,
        identityDateOfIssue: rental.rentalDetail.landlordIdentifyDate,
        identityPlaceOfIssue: rental.rentalDetail.landlordIdentifyAddress,
        birthday: rental.rentalDetail.landlordBirthday,
        electricPrice: rental.rentalDetail.electricPrice,
        waterPrice: rental.rentalDetail.waterPrice,
      };
    } catch (err) {
      this.logger.error('Calling getLatestModInfo()', err, RentalService.name);
      throw err;
    }
  }

  async modUpdateRentalInfo(updateRentalDto: UpdateRentalDTO) {
    try {
    } catch (err) {
      this.logger.error(
        'Calling modUpdateRentalInfo()',
        err,
        RentalService.name,
      );
      throw err;
    }
  }

  async setRentalDTO(rental: Rental): Promise<MyRentalDTO> {
    const rating = await this.ratingService.findByRoom(rental.room.id);

    const dto: MyRentalDTO = {
      // set rentalInfo
      rentalInfo: {
        id: rental.id,
        rentalDetailId: rental.rentalDetail.id,
        electricPrice: rental.rentalDetail.electricPrice,
        waterPrice: rental.rentalDetail.waterPrice,
        additionalPrice: rental.rentalDetail.addtionalPrice,
        leaseTerm: rental.rentalDetail.leaseTerm,
        leaseTerminationCost: rental.rentalDetail.leaseTerminationCost,
        moveInDate: rental.rentalDetail.moveInDate,
        moveOutDate: rental.rentalDetail.moveOutDate,
        numberOfTenants: rental.tenants,
      },
      // set hostInfo
      hostInfo: {
        birthday: rental.rentalDetail.landlordBirthday,
        email: rental.landlord.email,
        firstName: rental.landlord.firstName,
        id: rental.landlord.id,
        identityDateOfIssue: rental.rentalDetail.landlordIdentifyDate,
        identityPlaceOfIssue: rental.rentalDetail.landlordIdentifyAddress,
        identityNumber: rental.rentalDetail.landlordIdentifyNo,
        lastname: rental.landlord.lastName,
        phone: rental.landlord.phoneNumber,
      },
      // set renterInfo
      renterInfo: {
        email: rental.renter.email,
        firstName: rental.renter.firstName,
        id: rental.renter.id,
        identityDateOfIssue: rental.rentalDetail.renterIdentifyDate,
        identityNumber: rental.rentalDetail.renterIdentifyNo,
        identityPlaceOfIssue: rental.rentalDetail.renterIdentifyAddress,
        lastname: rental.renter.lastName,
        phone: rental.renter.phoneNumber,
        birthday: rental.rentalDetail.renterBirthday,
      },
      // set roomInfo
      roomInfo: {
        area: rental.room.area,
        depositAmount: rental.room.depositAmount,
        id: rental.room.id,
        images: rental.room.images,
        price: rental.room.price,
        roomName: rental.room.roomName,
        utilities: rental.room.utilities,
        roomRatings: {
          avgRate: rating ? rating.avgRate : 0,
          numberOfRatings: rating ? rating.totalRating : 0,
        },
      },
      // set RoomBlockInfo
      roomBlockInfo: {
        address: rental.room.roomblock.address,
        city: rental.room.roomblock.city,
        description: rental.room.roomblock.description,
        district: rental.room.roomblock.district,
        id: rental.room.roomblock.id,
        lattitude: rental.room.roomblock.coordinate.latitude,
        longitude: rental.room.roomblock.coordinate.longitude,
      },
    };
    return dto;
  }

  async getListRental(userLogined: UserRtnDto, keyword: string) {
    try {
      let rentals = null;
      if (!keyword) keyword = '';
      const likeQr = { $like: `%${keyword}%` };
      if (userLogined.role === Role.ADMIN) {
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
            {
              renter: {
                $or: [
                  { firstName: likeQr },
                  { lastName: likeQr },
                  { phoneNumber: likeQr },
                ],
              },
            },
            {
              room: {
                $or: [
                  {
                    roomblock: {
                      $or: [
                        { description: likeQr },
                        { address: likeQr },
                        { city: likeQr },
                        { country: likeQr },
                        { district: likeQr },
                      ],
                    },
                  },
                  { roomName: likeQr },
                ],
              },
            },
            { status: likeQr },
            { tenants: likeQr },
          ],
        };
        rentals = await this.em.find(Rental, queryObj, {
          populate: [
            'landlord',
            'renter',
            'room',
            'room.roomblock',
            'rentalDetail',
          ],
        });
      } else if (userLogined.role === Role.MOD) {
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
            {
              renter: {
                $or: [
                  { id: userLogined.id },
                  { firstName: likeQr },
                  { lastName: likeQr },
                  { phoneNumber: likeQr },
                ],
              },
            },
            {
              room: {
                $or: [
                  {
                    roomblock: {
                      $or: [
                        { description: likeQr },
                        { address: likeQr },
                        { city: likeQr },
                        { country: likeQr },
                        { district: likeQr },
                      ],
                    },
                  },
                  { roomName: likeQr },
                ],
              },
            },
            { status: likeQr },
            { tenants: likeQr },
          ],
        };
        rentals = await this.em.find(Rental, queryObj, {
          populate: [
            'landlord',
            'renter',
            'room',
            'room.roomblock',
            'rentalDetail',
          ],
        });
      } else {
        throw new UnauthorizedException('You are not access to this route');
      }
      const rentalsDTO: MyRentalDTO[] = [];
      if (rentals.length < 1) {
        return rentalsDTO;
      }
      for (const rental of rentals) {
        const dto = await this.setRentalDTO(rental);
        rentalsDTO.push(dto);
      }
      return rentalsDTO;
    } catch (error) {
      throw error;
    }
  }
}
