import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AWSService {
  private readonly s3Client: S3Client;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    try {
      const clientParams = {
        region: process.env.AWS_BUCKET_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
      };
      this.s3Client = new S3Client(clientParams);
    } catch (err) {
      this.logger.error('Calling constructor()', err, AWSService.name);
      throw err;
    }
  }

  getObjectUrl(folderPath: string, fileName: string): string {
    return `${this.configService.get<string>(
      'AWS_BUCKET_URL',
    )}/${folderPath}/${fileName}`;
  }

  extractObjectNameFromUrl(objectUrl: string): string {
    const url = new URL(objectUrl);
    return url.pathname.replace('/', '');
  }

  async bulkDeleteObject(filePath: string) {
    try {
      const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: this.extractObjectNameFromUrl(filePath),
      };

      await this.s3Client.send(new DeleteObjectCommand(param));
    } catch (err) {
      this.logger.error('Calling deleteObject()', err, AWSService.name);
      throw err;
    }
  }

  async bulkPutObject(file: Express.Multer.File): Promise<string> {
    try {
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const fileName = `photo/${timestamp}/${file.originalname}`;
      file.originalname = file.originalname.replace(/ /g, '');
      const cmd = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        ContentType: file.mimetype,
        Body: file.buffer,
      });

      await this.s3Client.send(cmd);

      return this.getObjectUrl(`photo/${timestamp}`, file.originalname);
    } catch (err) {
      this.logger.error('Calling bulkPutObject()', err, AWSService.name);
      throw err;
    }
  }
}
