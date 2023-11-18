import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transacsionService: TransactionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @Get()
  async getAllTransaction(@Res() res: Response, @Req() req) {
    try {
    } catch (error) {
      this.logger.error(
        'Calling getAllTransaction()',
        error,
        TransactionController.name,
      );
      throw error;
    }
  }
  @Get(':id')
  async getTransactionById(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) paymentId: number,
  ) {
    try {
    } catch (error) {
      this.logger.error(
        'Calling getTransactionById()',
        error,
        TransactionController.name,
      );
      throw error;
    }
  }
}
