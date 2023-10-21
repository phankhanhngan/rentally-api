import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Utility, Utility, Utility } from 'src/entities/utility.entity';
import { Logger } from 'winston';
import { UtilitiesDTO } from './dtos/UtilitiesDTO';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/entities';

@Injectable()
export class UtilitiesService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Utility)
    private readonly utilitiesRepository: EntityRepository<Utility>,
    private readonly em: EntityManager,
  ) {}
  async findAllUtility() {
    try {
      const utilities = await this.utilitiesRepository.find({});
      const utilitiesDTO = utilities.map((el) => {
        const dto = plainToInstance(UtilitiesDTO, el);
        return dto;
      });
      return utilitiesDTO;
    } catch (error) {
      this.logger.error(
        'Calling findAllUtility()',
        error,
        UtilitiesService.name,
      );
      throw error;
    }
  }
  async addUtility(user: User, dto: UtilitiesDTO) {
    try {
      const utility = plainToInstance(Utility, dto);
      utility.created_at = new Date();
      utility.updated_at = new Date();
      utility.created_id = user.id;
      utility.updated_id = user.id;
      await this.em.persistAndFlush(utility);
    } catch (error) {
      this.logger.error('Calling addUtility()', error, UtilitiesService.name);
      throw error;
    }
  }
  async updateUtility(user: User, dto: UtilitiesDTO, id: number) {
    try {
      const utilityDb = await this.utilitiesRepository.findOne({ id: id });
      if (!utilityDb) {
        throw new BadRequestException(`Can't find utility with id=${id}`);
      }
      utilityDb.name = dto.name;
      utilityDb.note = dto.note;
      utilityDb.updated_at = new Date();
      utilityDb.updated_id = user.id;
      await this.em.persistAndFlush(utilityDb);
    } catch (error) {
      this.logger.error('Calling addUtility()', error, UtilitiesService.name);
      throw error;
    }
  }
}
