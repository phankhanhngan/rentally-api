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

  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  @Get()
  async getListRental(
    @Res() res: Response,
    @Req() req,
    @Query('keyword') keyword: string,
  ) {
    try {
      const userLogined = req.user;
      const data = await this.rentalService.getListRental(userLogined, keyword);
      res.status(200).json({
        message: 'Get all rental successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getListRental()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }

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
        message: `Request rent room successfully`,
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

  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  @Get('/:id')
  async getRentalById(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    try {
      const rental = await this.rentalService.getRentalById(id, req.user);
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
  @Put('/:id/approve')
  async approveRentalRequest(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.rentalService.approveRentalRequest(id, req.user);
      res.status(200).json({
        success: true,
        message: `Approve rental request successfully`,
      });
    } catch (error) {
      this.logger.error(
        'Calling approveRentalRequest()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Put('/:id/cancel')
  async cancelRentalRequest(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.rentalService.cancelRentalRequest(id, req.user);
      res.status(200).json({
        success: true,
        message: `Cancel rental request successfully`,
      });
    } catch (error) {
      this.logger.error(
        'Calling cancelRentalRequest()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Put('/:id/accept-break')
  async acceptBreakRentalRequest(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.rentalService.acceptBreakRentalRequest(id, req.user);
      res.status(200).json({
        success: true,
        message: `Accept break rental contract successfully`,
      });
    } catch (error) {
      this.logger.error(
        'Calling acceptBreakRentalRequest()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }

  @Put('/:id/end')
  async endRentalContract(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.rentalService.endRentalContract(id, req.user);
      res.status(200).json({
        success: true,
        message: `End rental contract successfully`,
      });
    } catch (error) {
      this.logger.error(
        'Calling endRentalContract()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }

  @Put('/my-rental/:id/confirm')
  async confirmRentalRequest(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const session = await this.rentalService.confirmRentalRequest(
        id,
        req.user,
      );
      res.status(200).json({
        success: true,
        message: `Confirm rental contract successfully`,
        data: session,
      });
    } catch (error) {
      this.logger.error(
        'Calling confirmRentalRequest()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }

  @Put('/my-rental/:id/request-break')
  async requestBreakRentalRequest(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.rentalService.requestBreakRentalRequest(id, req.user);
      res.status(200).json({
        success: true,
        message: `Request break rental contract successfully`,
      });
    } catch (error) {
      this.logger.error(
        'Calling requestBreakRentalRequest()',
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
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe())
    updateRentalDto: UpdateRentalDTO,
  ) {
    try {
      await this.rentalService.modUpdateRentalInfo(
        id,
        req.user,
        updateRentalDto,
      );
      res.status(200).json({
        success: true,
        message: `Update rental successfully`,
      });
    } catch (error) {
      this.logger.error(
        'Calling modUpdateRentalInfo()',
        error,
        RentalController.name,
      );
      throw error;
    }
  }
}
