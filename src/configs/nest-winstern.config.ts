import { utilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const NestWinsternConfig = (): WinstonModuleOptions => {
  return {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          utilities.format.nestLike('MyApp', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    ],
  };
};

export default NestWinsternConfig;
