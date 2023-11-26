import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckListDTO } from './dtos/Checklist.dto';
import { EntityManager } from '@mikro-orm/mysql';
import { Checklist } from 'src/entities/checklist.entity';
import { UsersService } from '../users/users.service';
import { Room } from 'src/entities';
import { RatingService } from '../rating/rating.service';
import { plainToClass } from 'class-transformer';
import { UtilitiesService } from '../utilities/utilities.service';
import { ChecklistRoomDTO } from './dtos/room-checklist.dto';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly ratingService: RatingService,
    private readonly userService: UsersService,
    private readonly utilitiesService: UtilitiesService,
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
        },
      );
      const dtos = [];
      for (let i = 0; i < checklist.length; i++) {
        const roomsDto = plainToClass(ChecklistRoomDTO, checklist[i].room);
        roomsDto.city = checklist[i].room.roomblock.city;
        roomsDto.country = checklist[i].room.roomblock.country;
        roomsDto.roomName = checklist[i].room.roomName;
        roomsDto.address = checklist[i].room.roomblock.address;
        roomsDto.district = checklist[i].room.roomblock.district;
        roomsDto.coordinate = checklist[i].room.roomblock.coordinate;
        roomsDto.isInCheckList = true;
        const utilities = JSON.parse(checklist[i].room.utilities);
        const utilitiesDetail = [];
        for (let j = 0; j < utilities.length; j++) {
          const utilityDto = await this.utilitiesService.getUtilityById(
            utilities[j],
          );
          utilitiesDetail.push(utilityDto);
        }
        roomsDto.utilities = utilitiesDetail;
        const rating = await this.ratingService.findByRoom(
          checklist[i].room.id,
        );

        if (rating.ratings) roomsDto.avgRate = rating.avgRate;
        dtos.push(roomsDto);
      }
      return dtos;
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
      if (checklistDb) {
        await this.em.removeAndFlush(checklistDb);
        return false;
      }
      const checklist = new Checklist();
      checklist.renter = renter;
      checklist.room = room;
      checklist.created_id = idLogined;
      checklist.updated_id = idLogined;
      checklist.created_at = new Date();
      checklist.updated_at = new Date();
      await this.em.persistAndFlush(checklist);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
