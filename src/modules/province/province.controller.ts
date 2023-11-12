import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('provinces')
export class ProvinceController {
  constructor(
    private readonly provineService: ProvinceService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @Get()
  async getAllProvinces() {
    try {
      return await this.provineService.getAllProvince();
    } catch (error) {
      this.logger.error(
        'Calling getAllProvinces()',
        error,
        ProvinceController.name,
      );
      throw error;
    }
  }
  @Get(':id/districts')
  async getDistrictsByProvince(@Param('id') id: string) {
    try {
      return await this.provineService.getDistrictsByProvince(id);
    } catch (error) {
      this.logger.error(
        'Calling getDistrictsByProvince()',
        error,
        ProvinceController.name,
      );
      throw error;
    }
  }
}
