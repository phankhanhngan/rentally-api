import { BadRequestException, Injectable } from '@nestjs/common';
import { RatingDTO } from './dto/rating.dto';
import { EntityManager } from '@mikro-orm/mysql';
import { RentalService } from '../rental/rental.service';
import { RatingStatus, RentalStatus } from 'src/common/enum/common.enum';
import { RoomRating } from 'src/entities/room-rating.entity';
import { RatingRtnDTO } from './dto/rating-rtn.dto';
import { plainToClass } from 'class-transformer';
import { UserRatingDTO } from './dto/user-rating.dto';

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
      rental.ratingStatus = RatingStatus.RATED;
      this.em.persist(rating);
      this.em.persist(rental);
      await this.em.flush();
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
  async findByRoom(roomId: string) {
    try {
      // const room = await this.roomsService.findRoomById(roomId);
      const qb = this.em.getKnex().raw(
        `SELECT rt.id, rt.created_at as createdAt,
         rt.comment as comment, rt.clean_rate as cleanRate,
         rt.location_rate as locationRate,
         rt.security_rate as securityRate,
         rt.support_rate as supportRate,
         (rt.clean_rate + rt.location_rate + rt.security_rate + rt.support_rate) / 4 as avgRate,  
         concat(u.first_name, ' ', u.last_name) as renterName,
         u.photo as renterPhoto
         FROM rentally.room_ratings rt  
        inner join users u on u.id  = rt.renter_id
        where rt.room_id = :id`,
        { id: roomId },
      );
      const res = await this.em.execute(qb);
      const result = new RatingRtnDTO();
      if (res.length < 1) {
        return {
          ratings: [],
          avgRate: 0,
        };
      }
      const totalRating = res.length;
      const userRatings: UserRatingDTO[] = [];
      let avgRate = 0,
        avgClean = 0,
        avgLocation = 0,
        avgSecurity = 0,
        avgSupport = 0;
      for (let index = 0; index < res.length; index++) {
        res[index].avgRate = Number(res[index].avgRate);
        avgRate += parseFloat(res[index].avgRate);
        res[index].avgRate = Math.round(
          parseFloat(res[index].avgRate.toFixed(1)),
        );
        avgClean += res[index].cleanRate;
        avgLocation += res[index].locationRate;
        avgSecurity += res[index].securityRate;
        avgSupport += res[index].supportRate;
        userRatings.push(plainToClass(UserRatingDTO, res[index]));
      }
      result.ratings = userRatings;
      (result.avgRate = Math.round(
        parseFloat((avgRate / totalRating).toFixed(1)),
      )),
        (result.avgClean = parseFloat((avgClean / totalRating).toFixed(1)));
      result.avgLocation = parseFloat((avgLocation / totalRating).toFixed(1));
      result.avgSecurity = parseFloat((avgSecurity / totalRating).toFixed(1));
      result.avgSupport = parseFloat((avgSupport / totalRating).toFixed(1));
      result.totalRating = totalRating;
      return result;
    } catch (error) {
      throw error;
    }
  }
}
