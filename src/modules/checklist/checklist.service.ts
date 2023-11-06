import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckListDTO } from './dtos/Checklist.dto';
import { EntityManager } from '@mikro-orm/mysql';
import { Checklist } from 'src/entities/checklist.entity';
import { RoomsService } from '../admin/rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { Room } from 'src/entities';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly em: EntityManager,
    private readonly roomService: RoomsService,
    private readonly userService: UsersService,
  ) {}
  async findAllMyChecklist(idLogined: any) {
    try {
      const checklist = await this.em.find(
        Checklist,
        {
          renter: { id: idLogined },
        },
        { populate: ['renter', 'room', 'room.roomblock'] },
      );
      return checklist;
    } catch (error) {
      throw error;
    }
  }
  async addToChecklist(checkListDTO: CheckListDTO, idLogined: any) {
    try {
      const room = await this.em.findOne(Room, { id: checkListDTO.roomId });
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
