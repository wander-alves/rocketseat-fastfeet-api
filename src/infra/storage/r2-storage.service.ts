import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

import {
  Uploader,
  type UploadParams,
} from '@/domain/delivery/application/storage/uploader';
import { EnvService } from '@/infra/env/env.service';

@Injectable()
class R2Storage implements Uploader {
  private client: S3Client;
  private envService: EnvService;

  constructor(envService: EnvService) {
    this.envService = envService;

    const accountId = this.envService.get('CLOUDFLARE_ACCOUNT_ID');
    const accessKeyId = this.envService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.envService.get('AWS_SECRET_ACCESS_KEY');

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload({ fileName, fileType, body }: UploadParams) {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;
    const bucketName = this.envService.get('AWS_BUCKET_NAME');

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      url: uniqueFileName,
    };
  }
}

export { R2Storage };
