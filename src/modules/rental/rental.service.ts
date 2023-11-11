import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import {
  RatingStatus,
  RentalStatus,
  RoomStatus,
} from 'src/common/enum/common.enum';
import { Rental } from 'src/entities/rental.entity';
import { MyRentalDTO } from './user-rental/dtos/MyRental.dto';
import { RatingService } from '../rating/rating.service';
import { CreateRentalDTO } from './user-rental/dtos/CreateRental.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Room, User } from 'src/entities';
import { RentalDetail } from 'src/entities/rental_detail.entity';

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
      console.log(rentals);
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
      const moveInDate = new Date(createRentalDTO.rentalInfo.moveInDate);

      const rentalDetail = {
        moveInDate: moveInDate,
        moveOutDate: new Date(
          moveInDate.setMonth(
            moveInDate.getMonth() + createRentalDTO.rentalInfo.leaseTerm,
          ),
        ),
        leaseTerm: createRentalDTO.rentalInfo.leaseTerm,
        renterIdentifyNo: createRentalDTO.tenantInfo.identityNumber,
        renterIdentifyDate: createRentalDTO.tenantInfo.identityDateOfIssue,
        renterIdentifyAddress: createRentalDTO.tenantInfo.identityPlaceOfIsse,
        renterBirthday: createRentalDTO.tenantInfo.birthday,
        monthlyRent: parseInt(room.price.toString()),
      };

      const rentalDetailEntity =
        this.rentalDetailRepository.create(rentalDetail);
      this.em.persist(rentalDetailEntity);

      const rental = {
        landlord,
        renter,
        room,
        ratingStatus: RatingStatus.NONE,
        tenants: createRentalDTO.rentalInfo.numberOfTenants,
        rentalDetail: rentalDetailEntity,
      };
      this.em.persist(rental);
      this.em.flush();
    } catch (err) {
      this.logger.error('Calling create()', err, RentalService.name);
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
}
