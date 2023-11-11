import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { CreateRentalDTO } from './user-rental/dtos/CreateRental.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('rental')
@UseGuards(JwtAuthGuard)
export class RentalController {
  constructor(
    private readonly rentalService: RentalService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(RoleAuthGuard([Role.USER]))
  @Post()
  async createRental(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe())
    createRentalDTO: CreateRentalDTO,
  ) {
    try {
      await this.rentalService.create(createRentalDTO, req.user);
      res.status(200).json({
        success: true,
        message: `Request rent room with id=[${createRentalDTO.roomId}] successfully`,
      });
    } catch (error) {
      this.logger.error('Calling createRental()', error, RentalController.name);
      throw error;
    }
  }
}
