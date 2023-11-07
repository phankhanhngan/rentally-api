import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { Rental } from 'src/entities/rental.entity';

@Injectable()
export class UserRentalService {
  //   constructor(private readonly em: EntityManager) {}
  //   async getMyRental(idLogined: any) {
  //     try {
  //       return await this.em.find(
  //         Rental,
  //         { renter: { id: idLogined } },
  //         {
  //           populate: [
  //             'landlord',
  //             'renter',
  //             'room',
  //             'room.roomblock',
  //             'rentalDetail',
  //           ],
  //         },
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
