import { EntityManager } from '@mikro-orm/mysql';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { RentalStatus } from 'src/common/enum/common.enum';
import { Rental } from 'src/entities/rental.entity';
import { MyRentalDTO } from './user-rental/dtos/MyRental.dto';
import { RatingService } from '../rating/rating.service';

@Injectable()
export class RentalService {
  constructor(
    @Inject(forwardRef(() => RatingService))
    private readonly ratingService: RatingService,
    private readonly em: EntityManager,
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
      throw error;
    }
  }
  async getMyRental(idLogined: any) {
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
        const dto = new MyRentalDTO();
        await this.setRentalDTO(rental, dto);
        rentalsDTO.push(dto);
      }
      return rentalsDTO;
    } catch (error) {
      throw error;
    }
  }
  async setRentalDTO(rental: Rental, dto: MyRentalDTO) {
    // set rentalInfo
    dto.rentalInfo.id = rental.id;
    dto.rentalInfo.rentalDetailId = rental.rentalDetail.id;
    dto.rentalInfo.electricPrice = rental.rentalDetail.electricPrice;
    dto.rentalInfo.waterPrice = rental.rentalDetail.waterPrice;
    dto.rentalInfo.additionalPrice = rental.rentalDetail.addtionalPrice;
    dto.rentalInfo.leaseTerm = rental.rentalDetail.leaseTerm;
    dto.rentalInfo.leaseTerminationCost =
      rental.rentalDetail.leaseTerminationCost;
    dto.rentalInfo.moveInDate = rental.rentalDetail.moveInDate;
    dto.rentalInfo.moveOutDate = rental.rentalDetail.moveOutDate;
    dto.rentalInfo.numberOfTenants = rental.tenants;
    // set hostInfo
    dto.hostInfo.birthday = rental.rentalDetail.landlordBirthday;
    dto.hostInfo.email = rental.landlord.email;
    dto.hostInfo.firstName = rental.landlord.firstName;
    dto.hostInfo.id = rental.landlord.id;
    dto.hostInfo.identityDateOfIssue = rental.rentalDetail.landlordIdentifyDate;
    dto.hostInfo.identityPlaceOfIssue =
      rental.rentalDetail.landlordIdentifyAddress;
    dto.hostInfo.identityNumber = rental.rentalDetail.landlordIdentifyNo;
    dto.hostInfo.lastname = rental.landlord.lastName;
    dto.hostInfo.phone = rental.landlord.phoneNumber;
    // set renterInfo
    dto.renterInfo.birthday = rental.rentalDetail.renterBirthday;
    dto.renterInfo.email = rental.renter.email;
    dto.renterInfo.firstName = rental.renter.firstName;
    dto.renterInfo.id = rental.renter.id;
    dto.renterInfo.identityDateOfIssue = rental.rentalDetail.renterIdentifyDate;
    dto.renterInfo.identityNumber = rental.rentalDetail.renterIdentifyNo;
    dto.renterInfo.identityPlaceOfIssue =
      rental.rentalDetail.renterIdentifyAddress;
    dto.renterInfo.lastname = rental.renter.lastName;
    dto.renterInfo.phone = rental.renter.phoneNumber;
    // set roomInfo
    dto.roomInfo.area = rental.room.area;
    dto.roomInfo.depositAmount = rental.room.depositAmount;
    dto.roomInfo.id = rental.room.id;
    dto.roomInfo.images = rental.room.images;
    dto.roomInfo.price = rental.room.price;
    dto.roomInfo.roomName = rental.room.roomName;
    dto.roomInfo.utilities = rental.room.utilities;
    const rating = await this.ratingService.findByRoom(rental.room.id);
    if (rating.ratings) {
      dto.roomInfo.roomRatings.avgRate = rating.avgRate;
      dto.roomInfo.roomRatings.numberOfRatings = rating.totalRating;
    } else {
      dto.roomInfo.roomRatings.avgRate = 0;
      dto.roomInfo.roomRatings.numberOfRatings = 0;
    }
    // set RoomBlockInfo
    dto.roomBlockInfo.address = rental.room.roomblock.address;
    dto.roomBlockInfo.city = rental.room.roomblock.city;
    dto.roomBlockInfo.description = rental.room.roomblock.description;
    dto.roomBlockInfo.district = rental.room.roomblock.district;
    dto.roomBlockInfo.id = rental.room.roomblock.id;
    dto.roomBlockInfo.lattitude = rental.room.roomblock.coordinate.latitude;
    dto.roomBlockInfo.longitude = rental.room.roomblock.coordinate.longitude;
  }
}
