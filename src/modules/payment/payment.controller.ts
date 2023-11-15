import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { PaymentService } from './payment.service';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { Response } from 'express';
import { UpdatePaymentDTO } from './dtos/update-payment.dto';
import { User } from '../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly paymentService: PaymentService,
  ) {}
  //@UseGuards(RoleAuthGuard([Role.ADMIN, Role.USER]))
  // @Get('check-out')
  // async checkOutPayment(
  //   @Req() req,
  //   @Res() res: Response,
  //   // @Body(new ValidationPipe())
  //   // paymentDTO: UpdatePaymentDTO,
  // ) {
  //   try {
  //     res.redirect('youtube.com');
  //   } catch (error) {
  //     this.logger.error(
  //       'Calling checkOutPayment()',
  //       error,
  //       PaymentController.name,
  //     );
  //     throw error;
  //   }
  // }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Post()
  async createPayment(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe())
    paymentDTO: CreatePaymentDTO,
  ) {
    try {
      const idLogined = req.user.id;
      await this.paymentService.createPayment(paymentDTO, idLogined);
      res.status(200).json({
        message: 'Created payment successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error(
        'Calling createPayment()',
        error,
        PaymentController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Put(':id')
  async updatePayment(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) paymentId: number,
    @Body(new ValidationPipe())
    paymentDTO: UpdatePaymentDTO,
  ) {
    try {
      const idLogined = req.user.id;
      await this.paymentService.updatePayment(paymentDTO, idLogined, paymentId);
      res.status(200).json({
        message: 'Updated payment successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error(
        'Calling updatePayment()',
        error,
        PaymentController.name,
      );
      throw error;
    }
  }
  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Delete(':id')
  async deletePayment(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) paymentId: number,
  ) {
    try {
      await this.paymentService.deletePayment(paymentId);
      res.status(200).json({
        message: 'Deleted payment successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error(
        'Calling deletePayment()',
        error,
        PaymentController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  @Get(':id')
  async findPaymentById(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) paymentId: number,
  ) {
    try {
      const user = req.user;
      const paymentDTO = await this.paymentService.findByIdRtn(user, paymentId);

      res.status(200).json({
        message: 'Get payment successfully',
        status: 'success',
        data: paymentDTO,
      });
    } catch (error) {
      this.logger.error(
        'Calling findPaymentById()',
        error,
        PaymentController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  @Get()
  async findAllPayment(
    @Req() req,
    @Res() res: Response,
    @Query('keyword') keyword: string,
  ) {
    try {
      const user = req.user;
      const paymentDTOs = await this.paymentService.findAll(user, keyword);

      res.status(200).json({
        message: 'Get all payment successfully',
        status: 'success',
        data: paymentDTOs,
      });
    } catch (error) {
      this.logger.error(
        'Calling findAllPayment()',
        error,
        PaymentController.name,
      );
      throw error;
    }
  }
}
