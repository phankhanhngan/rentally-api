import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { UtilitiesService } from './utilities.service';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { Request, Response } from 'express';
@UseGuards(JwtAuthGuard)
@Controller('utilities')
export class UtilitiesController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly utilitiesService: UtilitiesService,
  ) {}
  @UseGuards(RoleAuthGuard([Role.ADMIN, Role.MOD]))
  @Get()
  async findAllUtility(@Req() req: Request, @Res() res: Response) {
    try {
      const utilities = await this.utilitiesService.findAllUtility();
      res.status(200).json({
        status: 'success',
        message: 'Get utilities successfully',
        data: {
          utilities: utilities,
        },
      });
    } catch (error) {
      this.logger.error(
        'Calling findAllUtility()',
        error,
        UtilitiesController.name,
      );
      throw error;
    }
  }
}
