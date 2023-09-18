import { BadRequestException } from '@nestjs/common';
import * as mime from 'mime-types';

const fileFilter = {
  fileFilter: (req, file, cb) => {
    const ext: string = mime.extension(file.mimetype).toString();
    if (!['png', 'jpg', 'jpeg'].includes(ext)) {
      return cb(new BadRequestException('Extension not allowed'), false);
    }
    return cb(null, true);
  },
  limits: {
    fileSize: 10000000,
  },
};

export { fileFilter };
