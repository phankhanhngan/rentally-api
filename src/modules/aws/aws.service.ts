import {
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
          region: this.configService.get<string>('AWS_BUCKET_REGION'),
          credentials: {
            accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
            secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
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
  
    async bulkDeleteObject(filePaths: Array<string>) {
      try {
        if (filePaths.length > 0) {
          const params = {
            Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
            Delete: {
              Objects: filePaths.map((path) => ({
                Key: this.extractObjectNameFromUrl(path),
              })),
            },
          };
  
          await this.s3Client.send(new DeleteObjectsCommand(params));
        }
      } catch (err) {
        this.logger.error('Calling deleteObject()', err, AWSService.name);
        throw err;
      }
    }
  
    async bulkPutObject(
      folderPath: string,
      files: Array<Express.Multer.File> | Express.Multer.File,
    ): Promise<string[]> {
      try {
        if (!Array.isArray(files)) {
          files = [].concat(files);
        }
        const commands = files.map((file) => {
          file.originalname = file.originalname.replace(/ /g, '');
          return new PutObjectCommand({
            Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
            Key: `${folderPath}/${file.originalname}`,
            ContentType: file.mimetype,
            Body: file.buffer,
          });
        });
  
        await Promise.all(commands.map((cmd) => this.s3Client.send(cmd)));
  
        return files.map((file) =>
          this.getObjectUrl(folderPath, file.originalname),
        );
      } catch (err) {
        this.logger.error('Calling bulkPutObject()', err, AWSService.name);
        throw err;
      }
    }
  }