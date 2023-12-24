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
import Stripe from 'stripe';
import { MailerService } from '@nest-modules/mailer';
import { EventGateway } from '../notification/event.gateway';
import { UtilitiesService } from '../utilities/utilities.service';

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
    private readonly mailerService: MailerService,
    private readonly eventGateway: EventGateway,
    private readonly utilitiesService: UtilitiesService,
  ) {}
  feLink = 'https://rentally.netlify.app';
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

  async findByIdAndLandLord(
    rentalId: number,
    landlordId: number,
    status: RentalStatus,
  ) {
    try {
      const queryObj = {
        $and: [
          {
            landlord: {
              $and: [{ id: landlordId }],
            },
          },
          {
            id: rentalId,
          },
          {
            status: status,
          },
        ],
      };
      const rental = await this.em.findOne(Rental, queryObj, {
        populate: [
          'renter',
          'room',
          'landlord',
          'room.roomblock',
          'rentalDetail',
        ],
      });
      return rental;
    } catch (error) {
      this.logger.error(
        'Calling findByIdAndLandLord()',
        error,
        RentalService.name,
      );
      throw error;
    }
  }

  async getMyRental(
    idLogined: any,
    status: RentalStatus,
  ): Promise<MyRentalDTO[]> {
    try {
      let rentals;
      if (status) {
        rentals = await this.em.find(
          Rental,
          { renter: { id: idLogined }, status: status },
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
      } else {
        rentals = await this.em.find(
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
      this.logger.error('Calling getMyRental()', error, RentalService.name);
      throw error;
    }
  }

  async getMyRentalById(id: number, idLogined: any): Promise<MyRentalDTO> {
    try {
      const rental = await this.em.findOne(
        Rental,
        {
          id: id,
          renter: { id: idLogined },
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
        throw new BadRequestException('Cannot find rental');
      }
      return await this.setRentalDTO(rental);
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
        throw new BadRequestException(`Cannot find room`);
      }

      if (room.status != RoomStatus.EMPTY) {
        throw new BadRequestException(
          `This room was already rented by someone`,
        );
      }
      const rentalDb = await this.em.findOne(Rental, {
        room: { id: createRentalDTO.roomId },
        renter: { id: user.id },
      });

      // fix spam rental
      if (
        rentalDb &&
        (rentalDb.status === RentalStatus.CREATED ||
          rentalDb.status === RentalStatus.APPROVED)
      )
        throw new BadRequestException(
          'You has already created rental request for this room!',
        );
      //

      const landlord = this.em.getReference(User, room.roomblock.landlord.id);
      const renter = this.em.getReference(User, user.id);
      const moveinMoment = moment(
        createRentalDTO.rentalInfo.moveInDate,
        'DD/MM/YYYY',
      );
      if (!moveinMoment.isSameOrAfter(moment())) {
        throw new BadRequestException('Move in date must be in the future');
      }

      const moveInDate = moveinMoment.toDate();
      const rentalDetail = {
        moveInDate: moveInDate,
        moveOutDate: moment(moveInDate)
          .add(createRentalDTO.rentalInfo.leaseTerm, 'M')
          .toDate(),
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

      await this.em.flush();

      const dto = await this.setRentalDTO(rentalEntity);
      const rentalLink = this.feLink + '/mod/rentals/' + rentalEntity.id;
      this.sendMail(
        rentalEntity.landlord.email,
        rentalLink,
        dto,
        'Rental request was created',
        './rental_created',
      );

      // Send Notification
      this.eventGateway.sendNotificationRental(
        rentalEntity.landlord.id,
        'Rental request was created',
        rentalEntity.id,
      );
    } catch (err) {
      this.logger.error('Calling create()', err, RentalService.name);
      throw err;
    }
  }

  async getRentalById(id: number, user: any): Promise<MyRentalDTO> {
    try {
      const query = {
        id: id,
      };
      if (user.role === Role.MOD) {
        query['landlord'] = user;
      }
      const rental = await this.rentalRepository.findOne(query, {
        populate: [
          'landlord',
          'renter',
          'room',
          'room.roomblock',
          'rentalDetail',
        ],
      });
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
        photo: user.photo,
        firstName: user.firstName,
        lastName: user.lastName,
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

  async modUpdateRentalInfo(
    id: number,
    user: any,
    updateRentalDto: UpdateRentalDTO,
  ) {
    try {
      const rental = await this.rentalRepository.findOne(
        { id, landlord: user },
        { populate: ['rentalDetail'] },
      );
      if (!rental) {
        throw new BadRequestException(`Cannot find rental with id=[${id}]`);
      }
      rental.rentalDetail.electricPrice =
        updateRentalDto.rentalInfo.electricPrice;
      rental.rentalDetail.waterPrice = updateRentalDto.rentalInfo.waterPrice;
      rental.rentalDetail.addtionalPrice =
        updateRentalDto.rentalInfo.additionalPrice;
      rental.rentalDetail.leaseTerminationCost =
        updateRentalDto.rentalInfo.leaseTerminationCost;
      rental.rentalDetail.landlordBirthday = moment(
        updateRentalDto.hostInfo.birthday,
        'DD/MM/YYYY',
      ).toDate();
      rental.rentalDetail.landlordIdentifyNo =
        updateRentalDto.hostInfo.identityNumber;
      rental.rentalDetail.landlordIdentifyDate = moment(
        updateRentalDto.hostInfo.identityDateOfIssue,
        'DD/MM/YYYY',
      ).toDate();
      rental.rentalDetail.landlordIdentifyAddress =
        updateRentalDto.hostInfo.identityPlaceOfIssue;

      await this.em.persistAndFlush(rental.rentalDetail);
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
    const utilities = JSON.parse(rental.room.utilities);
    const utilitiesDetail = [];
    for (let j = 0; j < utilities.length; j++) {
      const utilityDto = await this.utilitiesService.getUtilityById(
        utilities[j],
      );
      utilitiesDetail.push(utilityDto);
    }
    const dto: MyRentalDTO = {
      status: rental.status,
      // set rentalInfo
      rentalInfo: {
        id: rental.id,
        photo: rental.renter.photo,
        rentalDetailId: rental.rentalDetail.id,
        electricPrice: rental.rentalDetail.electricPrice,
        waterPrice: rental.rentalDetail.waterPrice,
        additionalPrice: rental.rentalDetail.addtionalPrice,
        leaseTerm: rental.rentalDetail.leaseTerm,
        leaseTerminationCost: rental.rentalDetail.leaseTerminationCost,
        moveInDate: rental.rentalDetail.moveInDate,
        moveOutDate: rental.rentalDetail.moveOutDate,
        numberOfTenants: rental.tenants,
        ratingStatus: rental.ratingStatus,
      },
      // set hostInfo
      hostInfo: {
        birthday: rental.rentalDetail.landlordBirthday,
        photo: rental.landlord.photo,
        email: rental.landlord.email,
        firstName: rental.landlord.firstName,
        id: rental.landlord.id,
        identityDateOfIssue: rental.rentalDetail.landlordIdentifyDate,
        identityPlaceOfIssue: rental.rentalDetail.landlordIdentifyAddress,
        identityNumber: rental.rentalDetail.landlordIdentifyNo,
        lastName: rental.landlord.lastName,
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
        lastName: rental.renter.lastName,
        phone: rental.renter.phoneNumber,
        birthday: rental.rentalDetail.renterBirthday,
      },
      // set roomInfo
      roomInfo: {
        area: rental.room.area,
        depositAmount: rental.room.depositAmount,
        id: rental.room.id,
        images: JSON.parse(rental.room.images),
        price: rental.room.price,
        roomName: rental.room.roomName,
        utilities: utilitiesDetail,
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
      if (userLogined.role === Role.MOD) {
        queryObj['landlord'] = {
          id: userLogined.id,
        };
      }

      rentals = await this.em.find(Rental, queryObj, {
        populate: [
          'landlord',
          'renter',
          'room',
          'room.roomblock',
          'rentalDetail',
        ],
      });

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
      this.logger.error('Calling getListRental()', error, RentalService.name);
      throw error;
    }
  }

  async approveRentalRequest(id: number, user: any) {
    try {
      const rental = await this.rentalRepository.findOne(
        {
          id,
          landlord: user,
        },
        { populate: ['room', 'renter', 'room.roomblock', 'rentalDetail'] },
      );
      if (!rental) {
        throw new BadRequestException(`Cannot find rental with id=[${id}]`);
      }

      const roomCount = await this.roomRepository.count({
        id: rental.room.id,
        status: RoomStatus.EMPTY,
      });
      if (roomCount < 1) {
        throw new BadRequestException(
          `Room not found or this room has already been rented!`,
        );
      }

      if (rental.status != RentalStatus.CREATED) {
        throw new BadRequestException(
          `Only rental request with status ${RentalStatus.CREATED} could be approved`,
        );
      }

      if (rental.rentalDetail.landlordIdentifyNo == null) {
        throw new BadRequestException(
          `Please update neccessary information before approve this rental request`,
        );
      }

      rental.status = RentalStatus.APPROVED;
      await this.em.persistAndFlush(rental);
      const dto = await this.setRentalDTO(rental);
      const rentalLink = this.feLink + '/my-rental/' + rental.id;
      this.sendMail(
        rental.renter.email,
        rentalLink,
        dto,
        'Rental was approved',
        './rental_udpate_status',
        RentalStatus.CREATED,
        RentalStatus.APPROVED,
      );

      // Send Notification
      this.eventGateway.sendNotificationRental(
        rental.renter.id,
        'Rental was approved',
        rental.id,
      );
    } catch (err) {
      this.logger.error(
        'Calling approveRentalRequest()',
        err,
        RentalService.name,
      );
      throw err;
    }
  }

  async cancelRentalRequest(id: number, user: any) {
    try {
      const rental = await this.rentalRepository.findOne(
        {
          id,
          landlord: user,
        },
        { populate: ['room', 'renter', 'room.roomblock'] },
      );
      if (!rental) {
        throw new BadRequestException(`Cannot find rental with id=[${id}]`);
      }
      if (rental.status != RentalStatus.CREATED) {
        throw new BadRequestException(
          `Only rental request with status ${RentalStatus.CREATED} could be canceled`,
        );
      }

      rental.status = RentalStatus.CANCELED;
      rental.room.status = RoomStatus.EMPTY;

      await this.em.persistAndFlush(rental);
      const dto = await this.setRentalDTO(rental);
      const rentalLink = this.feLink + '/my-rental/' + rental.id;
      this.sendMail(
        rental.renter.email,
        rentalLink,
        dto,
        'Rental request was canceled',
        './rental_udpate_status',
        RentalStatus.CREATED,
        RentalStatus.CANCELED,
      );
      // Send Notification
      this.eventGateway.sendNotificationRental(
        rental.renter.id,
        'Rental request was canceled',
        rental.id,
      );
    } catch (err) {
      this.logger.error(
        'Calling cancelRentalRequest()',
        err,
        RentalService.name,
      );
      throw err;
    }
  }

  async acceptBreakRentalRequest(id: number, user: any) {
    try {
      const rental = await this.rentalRepository.findOne(
        {
          id,
          landlord: user,
        },
        { populate: ['room', 'renter', 'room.roomblock'] },
      );
      if (!rental) {
        throw new BadRequestException(`Cannot find rental with id=[${id}]`);
      }
      if (rental.status != RentalStatus.REQUEST_BREAK) {
        throw new BadRequestException(
          `Only rental request with status ${RentalStatus.REQUEST_BREAK} could be accepted break`,
        );
      }

      rental.status = RentalStatus.BROKEN;
      rental.room.status = RoomStatus.EMPTY;
      await this.em.persistAndFlush(rental);
      const dto = await this.setRentalDTO(rental);
      const rentalLink = this.feLink + '/my-rental/' + rental.id;
      this.sendMail(
        rental.renter.email,
        rentalLink,
        dto,
        'Rental was accepted to break',
        './rental_udpate_status',
        RentalStatus.REQUEST_BREAK,
        RentalStatus.BROKEN,
      );
      this.eventGateway.sendNotificationRental(
        rental.renter.id,
        'Rental was accepted to break',
        rental.id,
      );
    } catch (err) {
      this.logger.error(
        'Calling acceptBreakRentalRequest()',
        err,
        RentalService.name,
      );
      throw err;
    }
  }

  async confirmRentalRequest(id: number, user: any) {
    try {
      const rental = await this.rentalRepository.findOne(
        {
          id,
          renter: user,
        },
        { populate: ['room', 'renter', 'room.roomblock'] },
      );
      if (!rental) {
        throw new BadRequestException(`Cannot find rental`);
      }
      if (rental.status != RentalStatus.APPROVED) {
        throw new BadRequestException(
          `Only rental request with status ${RentalStatus.APPROVED} could be confirmed`,
        );
      }
      if (rental.room.status === RoomStatus.OCCUPIED) {
        throw new BadRequestException('This room are already OCCUPIED!');
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      console.log(
        `urlurl: ${process.env.STRIPE_DEPOSITED_SUCCESS_URL}/${rental.id}?confirm=success`,
      );
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${process.env.STRIPE_DEPOSITED_SUCCESS_URL}/${rental.id}?confirm=success`,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        mode: 'payment',
        customer_email: user.email,
        client_reference_id: rental.id.toString(),
        metadata: {
          rentalId: rental.id,
          createdAt: new Date().toDateString(),
          description: `${rental.renter.firstName} ${rental.renter.lastName} transfers deposit to rent (Room name: ${rental.room.roomName}).`,
          renterId: user.id,
          type: 'DEPOSITED',
        },
        line_items: [
          {
            price_data: {
              unit_amount: Number(rental.room.depositAmount),
              currency: process.env.STRIPE_CURRENCY,
              product_data: {
                name: `${rental.room.roomName}`,
                description: `${rental.renter.firstName} ${rental.renter.lastName} transfers deposit to rent (Room name: ${rental.room.roomName}).`,
                images: JSON.parse(rental.room.images),
              },
            },
            quantity: 1,
          },
        ],
      });
      return session;
    } catch (err) {
      this.logger.error(
        'Calling confirmRentalRequest()',
        err,
        RentalService.name,
      );
      throw err;
    }
  }

  async requestBreakRentalRequest(id: number, user: any) {
    try {
      const rental = await this.rentalRepository.findOne(
        {
          id,
          renter: user,
        },
        { populate: ['room', 'landlord', 'renter', 'room.roomblock'] },
      );
      if (!rental) {
        throw new BadRequestException(`Cannot find rental with id=[${id}]`);
      }
      if (rental.status != RentalStatus.COMPLETED) {
        throw new BadRequestException(
          `Only rental request with status ${RentalStatus.COMPLETED} could be requested break`,
        );
      }

      rental.status = RentalStatus.REQUEST_BREAK;
      await this.em.persistAndFlush(rental);
      const dto = await this.setRentalDTO(rental);
      const rentalLink = this.feLink + '/mod/rentals/' + rental.id;
      this.sendMail(
        dto.hostInfo.email,
        rentalLink,
        dto,
        'Rental was requested to break',
        './rental_udpate_status',
        RentalStatus.COMPLETED,
        RentalStatus.REQUEST_BREAK,
      );
      this.eventGateway.sendNotificationRental(
        dto.hostInfo.id,
        'Rental was requested to break',
        rental.id,
      );
    } catch (err) {
      this.logger.error(
        'Calling requestBreakRentalRequest()',
        err,
        RentalService.name,
      );
      throw err;
    }
  }

  async endRentalContract(id: number, user: any) {
    try {
      const rental = await this.rentalRepository.findOne(
        {
          id,
          landlord: user,
        },
        { populate: ['room', 'renter', 'rentalDetail', 'room.roomblock'] },
      );
      if (!rental) {
        throw new BadRequestException(`Cannot find rental with id=[${id}]`);
      }

      if (rental.status != RentalStatus.COMPLETED) {
        throw new BadRequestException(
          `Only rental request with status ${RentalStatus.COMPLETED} could be requested break`,
        );
      }

      const prevStatus = rental.status;
      console.log(prevStatus);
      rental.status = RentalStatus.ENDED;
      rental.room.status = RoomStatus.EMPTY;
      await this.em.persistAndFlush(rental);
      const dto = await this.setRentalDTO(rental);
      const rentalLink = this.feLink + '/my-rental/' + rental.id;
      this.sendMail(
        rental.renter.email,
        rentalLink,
        dto,
        'Rental was ended',
        './rental_udpate_status',
        prevStatus,
        RentalStatus.ENDED,
      );
      this.eventGateway.sendNotificationRental(
        rental.renter.id,
        'Rental was ended',
        rental.id,
      );
    } catch (err) {
      this.logger.error(
        'Calling requestBreakRentalRequest()',
        err,
        RentalService.name,
      );
      throw err;
    }
  }

  async sendMail(
    to: string,
    link: string,
    rental: MyRentalDTO,
    subject: string,
    template: string,
    status_from: RentalStatus = null,
    status_to: RentalStatus = null,
  ) {
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: subject,
        template: template,
        context: {
          link: link,
          status_from: status_from ? status_from : '',
          status_to: status_to ? status_to : '',
          rental: rental,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
