import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { RentalStatus } from 'src/common/enum/common.enum';
import { Rental } from 'src/entities/rental.entity';

@Injectable()
export class RentalService {
  constructor(private readonly em: EntityManager) {}
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
      return await this.em.find(
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
    } catch (error) {
      throw error;
    }
  }
}
