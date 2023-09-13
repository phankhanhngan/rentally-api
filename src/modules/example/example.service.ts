import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ExampleService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getSummary() {
    try {
      return 'Summary';
    } catch (err) {
      this.logger.error('Calling getSummary()', err, ExampleService.name);
      throw err;
    }
  }
}
