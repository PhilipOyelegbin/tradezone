import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Storage {
  public readonly config: ConfigService;
  private readonly client: S3Client;

  constructor(config: ConfigService) {
    this.config = config;
    this.client = new S3Client({
      region: 'auto',
      endpoint: this.config.getOrThrow('STORAGE_ENDPOINT'),
      credentials: {
        accessKeyId: this.config.getOrThrow('STORAGE_ACCESS_KEY'),
        secretAccessKey: this.config.getOrThrow('STORAGE_SECRET_KEY'),
      },
    });
  }

  uploadProductImages(fileName: string, file: Buffer) {
    return this.client.send(
      new PutObjectCommand({
        Bucket: this.config.getOrThrow('STORAGE_BUCKET_NAME'),
        Key: fileName,
        Body: file,
        ACL: 'public-read',
      }),
    );
  }

  deleteProductImages(fileName: string) {
    return this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.getOrThrow('STORAGE_BUCKET_NAME'),
        Key: fileName,
      }),
    );
  }
}
