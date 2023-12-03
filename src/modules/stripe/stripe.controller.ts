import {
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { PaymentService } from '../payment/payment.service';
import { Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
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
  @Post('check-out/:id')
  async checkOutPaymnent(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const session = await this.paymentService.checkOutPayment(
        id,
        req.user,
        req,
      );
      res.status(200).json({
        success: true,
        message: `Checkout payment successfully`,
        data: session.url,
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
