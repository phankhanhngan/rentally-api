import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckListDTO } from './dtos/Checklist.dto';
import { EntityManager } from '@mikro-orm/mysql';
import { Checklist } from 'src/entities/checklist.entity';
import { RoomsService } from '../admin/rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { Room } from 'src/entities';
import { RatingService } from '../rating/rating.service';
import { classToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly ratingService: RatingService,
    private readonly userService: UsersService,
    private readonly em: EntityManager,
  ) {}
  async findAllMyChecklist(idLogined: any) {
    try {
      const checklist = await this.em.find(
        Checklist,
        {
          renter: { id: idLogined },
        },
        {
          populate: ['room', 'room.roomblock', 'room.roomblock.landlord'],
          fields: [
            'id',
            'room.id',
            'room.roomName',
            'room.area',
            'room.price',
            'room.depositAmount',
            'room.images',
            'room.utilities',
            'room.status',
            'room.roomblock.id',
            'room.roomblock.address',
            'room.roomblock.city',
            'room.roomblock.district',
            'room.roomblock.country',
            'room.roomblock.coordinate',
            'room.roomblock.description',
            'room.roomblock.landlord.id',
            'room.roomblock.landlord.email',
            'room.roomblock.landlord.firstName',
            'room.roomblock.landlord.lastName',
            'room.roomblock.landlord.phoneNumber',
          ],
        },
      );
      const x = classToPlain(checklist);
      for (let i = 0; i < x.length; i++) {
        const rating = await this.ratingService.findByRoom(x[i].room.id);
        x[i].rating = rating;
      }
      return x;
    } catch (error) {
      throw error;
    }
  }

  async removeOfChecklist(checkListDTO: CheckListDTO, idLogined: any) {
    try {
      const room = await this.em.findOne(Room, { id: checkListDTO.roomId });
      if (!room)
        throw new BadRequestException(
          `Can not find room with id: [${checkListDTO.roomId}]`,
        );
      const queryObj = {
        $and: [
          {
            renter: {
              $and: [{ id: idLogined }],
            },
          },
          {
            room: {
              $and: [{ id: checkListDTO.roomId }],
            },
          },
        ],
      };
      const checklistDb = await this.em.findOne(Checklist, queryObj, {
        populate: ['room', 'renter'],
      });
      if (!checklistDb)
        throw new BadRequestException(
          'You don not have this room in your checklist!',
        );
      await this.em.removeAndFlush(checklistDb);
    } catch (error) {
      throw error;
    }
  }
  async addToChecklist(checkListDTO: CheckListDTO, idLogined: any) {
    try {
      const room = await this.em.findOne(Room, { id: checkListDTO.roomId });
      if (!room)
        throw new BadRequestException(
          `Can not find room with id: [${checkListDTO.roomId}]`,
        );
      const renter = await this.userService.getUserById(idLogined);
      const queryObj = {
        $and: [
          {
            renter: {
              $and: [{ id: idLogined }],
            },
          },
          {
            room: {
              $and: [{ id: checkListDTO.roomId }],
            },
          },
        ],
      };
      const checklistDb = await this.em.findOne(Checklist, queryObj, {
        populate: ['room', 'renter'],
      });
      if (checklistDb)
        throw new BadRequestException(
          'You are already add this room to checklist!',
        );
      const checklist = new Checklist();
      checklist.renter = renter;
      checklist.room = room;
      checklist.created_id = idLogined;
      checklist.updated_id = idLogined;
      checklist.created_at = new Date();
      checklist.updated_at = new Date();
      await this.em.persistAndFlush(checklist);
    } catch (error) {
      throw error;
    }
  }
}
