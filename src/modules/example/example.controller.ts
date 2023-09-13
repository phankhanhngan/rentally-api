import { Controller, Get, Inject, Res } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston/dist/winston.constants';
import { Logger } from 'winston';
import { Response } from 'express';

@Controller('/example')
export class ExampleController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/summary')
  async getSummary(@Res() res: Response) {
    try {
      res.status(200).json({
        message: 'hello',
      });
    } catch (err) {
      this.logger.error('Calling getSummary()', err, ExampleController.name);
      throw err;
    }
  }
}
