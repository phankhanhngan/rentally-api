import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { PaymentService } from '../payment.service';
import { Response } from 'express';
import { CheckOutDTO } from '../dtos/check-out.dto';
import * as Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('webhook')
  async webHookCallback(@Req() req, @Res() res: Response) {
    try {
      await this.paymentService.callBackWebHook(req);
      res.json({ received: true });
    } catch (error) {
      this.logger.error(
        'Calling checkOutPaymnent()',
        error,
        StripeController.name,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(RoleAuthGuard([Role.USER]))
  @Post('check-out')
  async checkOutPaymnent(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe())
    dto: CheckOutDTO,
  ) {
    try {
      const session = await this.paymentService.checkOutPayment(
        dto,
        req.user,
        req,
      );
      res.status(200).json({
        data: session,
      });
    } catch (error) {
      this.logger.error(
        'Calling checkOutPaymnent()',
        error,
        StripeController.name,
      );
      throw error;
    }
  }
}
