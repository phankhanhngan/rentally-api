import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RentalService } from '../rental.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('mod-rental')
export class ModRentalController {
  constructor(
    private readonly rentalService: RentalService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Get()
  async getMyRental(@Res() res: Response, @Req() req) {
    try {
      const idLogined = req.user.id;
      const myRental = await this.rentalService.getMyRental(idLogined);
      res.status(200).json({
        message: 'Get my rental successfully',
        status: 'success',
        data: myRental,
      });
    } catch (error) {
      this.logger.error(
        'Calling getMyRental()',
        error,
        ModRentalController.name,
      );
      throw error;
    }
  }
}
