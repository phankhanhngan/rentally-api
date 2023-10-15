import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Utility } from 'src/entities/utility.entity';
import { Logger } from 'winston';
import { UtilitiesDTO } from './dtos/UtilitiesDTO';
import { plainToInstance } from 'class-transformer';

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
}
