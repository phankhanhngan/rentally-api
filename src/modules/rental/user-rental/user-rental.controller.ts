import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enum/common.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { UserRentalService } from './user-rental.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('my-rental')
export class UserRentalController {
  constructor(
    private readonly userRentalServide: UserRentalService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @UseGuards(RoleAuthGuard([Role.USER]))
  @Get()
  async getMyRental(@Res() res: Response, @Req() req) {
    try {
      const idLogined = req.user.id;

      res.status(200).json({
        message: 'Get my rental successfully',
        status: 'success',
        data: idLogined,
      });
    } catch (error) {
      this.logger.error(
        'Calling getMyRental()',
        error,
        UserRentalController.name,
      );
      throw error;
    }
  }
}
