import { Controller, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { PaymentService } from '../payment.service';
import { Response } from 'express';
import { Role } from 'src/common/enum/common.enum';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stripe')
export class StripeController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly paymentService: PaymentService,
  ) {}
  @UseGuards(RoleAuthGuard([Role.USER]))
  @Post('check-out')
  async checkOutPaymnent(
    @Req() req,
    @Res() res: Response,
    // @Body(new ValidationPipe())
    // paymentDTO: CreatePaymentDTO,
  ) {
    try {
      res.redirect('https://www.youtube.com/watch?v=ijDQHbsYVs8');
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
