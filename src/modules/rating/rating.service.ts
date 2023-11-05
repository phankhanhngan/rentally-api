import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RatingDTO } from './dto/rating.dto';
import { EntityManager } from '@mikro-orm/mysql';
import { RentalService } from '../rental/rental.service';
import { RentalStatus } from 'src/common/enum/common.enum';
import { RoomRating } from 'src/entities/room-rating.entity';
import { Rental } from '../../entities/rental.entity';

@Injectable()
export class RatingService {
  constructor(
    private readonly em: EntityManager,
    private readonly rentalService: RentalService,
  ) {}
  async createRating(idLogin: any, ratingDto: RatingDTO) {
    try {
      const rental = await this.rentalService.findByIdAndRenter(
        ratingDto.rentalId,
        idLogin,
        RentalStatus.COMPLETED,
      );
      if (!rental) {
        throw new BadRequestException('You are not rent this rental!');
      }
      const ratingDb = await this.findByRenterAndRoomAndRental(
        rental.room.id,
        rental.renter.id,
        rental.id,
      );
      if (ratingDb) {
        throw new BadRequestException('You are already rated this room');
      }
      const rating = new RoomRating();
      rating.comment = ratingDto.comment;
      rating.rental = rental;
      rating.room = rental.room;
      rating.renter = rental.renter;
      rating.cleanRate = ratingDto.cleanRate;
      rating.locationRate = ratingDto.locationRate;
      rating.securityRate = ratingDto.securityRate;
      rating.supportRate = ratingDto.supportRate;
      rating.created_id = idLogin;
      rating.updated_id = idLogin;
      rating.created_at = new Date();
      rating.updated_at = new Date();
      await this.em.persistAndFlush(rating);
      return rating;
    } catch (error) {
      throw error;
    }
  }
  async findByRenterAndRoomAndRental(
    roomId: string,
    renterId: number,
    rentalId: number,
  ) {
    const queryObj = {
      $and: [
        {
          renter: {
            $and: [{ id: renterId }],
          },
        },
        {
          room: {
            $and: [{ id: roomId }],
          },
        },
        {
          rental: {
            $and: [{ id: rentalId }],
          },
        },
      ],
    };
    const rating = await this.em.findOne(RoomRating, queryObj, {
      populate: ['renter', 'room', 'rental'],
    });
    return rating;
  }
}
