import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { CreateRentalDTO } from './dtos/CreateRental.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateRentalDTO } from './dtos/UpdateRental.dto';

@Controller('rental')
@UseGuards(JwtAuthGuard)
export class RentalController {
  constructor(
    private readonly rentalService: RentalService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/my-rental')
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
      this.logger.error('Calling getMyRental()', error, RentalController.name);
      throw error;
    }
  }

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

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Get('/mod-info')
  async getModLatestInfo(@Req() req, @Res() res: Response) {
    try {
      const mod = await this.rentalService.getLatestModInfo(req.user);
      res.status(200).json({
        success: true,
        message: `Get latest mod info successfully`,
        data: {
          ...mod,
        },
      });
    } catch (error) {
      this.logger.error(
        'Calling getRentalbyId()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Get('/:id')
  async modGetRentalbyId(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    try {
      const rental = await this.rentalService.modGetRentalById(id, req.user);
      res.status(200).json({
        success: true,
        message: `Get rental successfully`,
        data: {
          rental,
        },
      });
    } catch (error) {
      this.logger.error(
        'Calling getRentalbyId()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Put('/:id')
  async modUpdateRentalInfo(
    @Req() req,
    @Res() res: Response,
    @Body()
    updateRentalDto: UpdateRentalDTO,
  ) {
    try {
      const rental = await this.rentalService.modUpdateRentalInfo(
        updateRentalDto,
      );
      res.status(200).json({
        success: true,
        message: `Get rental successfully`,
        data: {
          rental,
        },
      });
    } catch (error) {
      this.logger.error(
        'Calling getRentalbyId()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }
}
