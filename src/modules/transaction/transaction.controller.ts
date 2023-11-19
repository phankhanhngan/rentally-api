import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Response } from 'express';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transacsionService: TransactionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  @Get()
  async getAllTransaction(
    @Res() res: Response,
    @Req() req,
    @Query('keyword') keyword: string,
  ) {
    try {
      const dtos = await this.transacsionService.findAll(keyword, req);
      res.status(200).json({
        message: 'Get all transactions successfully',
        status: 'success',
        data: dtos,
      });
    } catch (error) {
      this.logger.error(
        'Calling getAllTransaction()',
        error,
        TransactionController.name,
      );
      throw error;
    }
  }
  @Get('my-transaction')
  async myTransaction(
    @Res() res: Response,
    @Req() req,
    @Query('keyword') keyword: string,
  ) {
    try {
      const dtos = await this.transacsionService.findMyTransaction(
        keyword,
        req,
      );
      res.status(200).json({
        message: 'Get my transactions successfully',
        status: 'success',
        data: dtos,
      });
    } catch (error) {
      this.logger.error(
        'Calling getAllTransaction()',
        error,
        TransactionController.name,
      );
      throw error;
    }
  }
  // @Get(':id')
  // async getTransactionById(
  //   @Res() res: Response,
  //   @Req() req,
  //   @Param('id', ParseIntPipe) paymentId: number,
  // ) {
  //   try {
  //   } catch (error) {
  //     this.logger.error(
  //       'Calling getTransactionById()',
  //       error,
  //       TransactionController.name,
  //     );
  //     throw error;
  //   }
  // }
}
