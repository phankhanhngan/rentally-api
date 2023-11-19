import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Utility } from 'src/entities/utility.entity';
import { Logger } from 'winston';
import { UtilitiesDTO } from './dtos/UtilitiesDTO';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/entities';
import { AddUtilityDTO } from './dtos/add-utility.dto';

@Injectable()
export class UtilitiesService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Utility)
    private readonly utilitiesRepository: EntityRepository<Utility>,
    private readonly em: EntityManager,
  ) {}
  async findAllUtility(keyword: string) {
    try {
      if (!keyword) keyword = '';
      const likeQr = { $like: `%${keyword}%` };
      const queryObj = {
        $or: [{ name: likeQr }, { note: likeQr }],
      };
      const utilities = await this.utilitiesRepository.find(queryObj);
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
  async addUtility(user: User, dto: AddUtilityDTO) {
    try {
      const utility = plainToInstance(Utility, dto);
      utility.icon = process.env.DEFAULT_UTILITY_ICON;
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
  async updateUtility(user: any, dto: AddUtilityDTO, id: number) {
    try {
      const utilityDb = await this.utilitiesRepository.findOne({ id: id });
      if (!utilityDb) {
        throw new BadRequestException(`Can't find utility`);
      }
      utilityDb.name = dto.name;
      utilityDb.note = dto.note;
      utilityDb.updated_at = new Date();
      utilityDb.updated_id = user.id;
      await this.em.persistAndFlush(utilityDb);
    } catch (error) {
      this.logger.error(
        'Calling updateUtility()',
        error,
        UtilitiesService.name,
      );
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const utilityDb = await this.utilitiesRepository.findOne({ id: id });
      if (!utilityDb) {
        throw new BadRequestException(`Can't find utility`);
      }
      await this.em.removeAndFlush(utilityDb);
    } catch (error) {
      this.logger.error(
        'Calling deleteUtility()',
        error,
        UtilitiesService.name,
      );
      throw error;
    }
  }

  async getUtilityById(id: number) {
    try {
      const utility = await this.utilitiesRepository.findOne({ id });
      if (!utility) {
        throw new BadRequestException(`Can't find utility with id=${id}`);
      }

      return plainToInstance(UtilitiesDTO, utility);
    } catch (error) {
      this.logger.error(
        'Calling getUtilityById()',
        error,
        UtilitiesService.name,
      );
      throw error;
    }
  }
}
