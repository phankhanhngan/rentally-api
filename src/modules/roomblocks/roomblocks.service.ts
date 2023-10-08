import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AddRoomBlockDTO } from './dtos/add-room-block.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { User, RoomBlock } from 'src/entities';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class RoomBlocksService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(RoomBlock)
    private readonly roomBlockRepository: EntityRepository<RoomBlock>,
    private readonly em: EntityManager,
  ) {}

  async addRoomBlock(dto: AddRoomBlockDTO) {
    try {
      const { landlordId } = dto;
      if ((await this.userRepository.count({ id: landlordId })) < 1) {
        throw new BadRequestException(
          `Can not find landlord with id=[${landlordId}]`,
        );
      }

      this.em.persistAndFlush(plainToInstance(RoomBlock, dto));
    } catch (error) {
      this.logger.error(
        'Calling addRoomBlock()',
        error,
        RoomBlocksService.name,
      );
      throw error;
    }
  }
}
