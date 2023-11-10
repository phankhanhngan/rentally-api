import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Province } from 'src/entities/province.entity';
import { ProvinceDTO } from './dtos/Province.dto';
import { District } from 'src/entities/district.entity';
import { DistrictDTO } from './dtos/District.dto';

@Injectable()
export class ProvinceService {
  constructor(private readonly em: EntityManager) {}
  async getAllProvince() {
    try {
      const provinces = await this.em.find(Province, {});
      const provincesDTO = plainToInstance(ProvinceDTO, provinces);
      return provincesDTO;
    } catch (error) {
      throw error;
    }
  }
  async getDistrictsByProvince(id: string) {
    try {
      const districts = await this.em.find(District, { province_code: id });
      const districtsDTO = plainToInstance(DistrictDTO, districts);
      return districtsDTO;
    } catch (error) {
      throw error;
    }
  }
}
