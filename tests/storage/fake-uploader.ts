import { randomUUID } from 'node:crypto';
import {
  Uploader,
  type UploadParams,
} from '@/domain/delivery/application/storage/uploader';

type Upload = {
  url: string;
} & UploadParams;

class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName, fileType, body }: UploadParams) {
    const url = randomUUID();

    this.uploads.push({
      url,
      fileType,
      fileName,
      body: Buffer.from(JSON.stringify(body)),
    });

    return {
      url,
    };
  }
}

export { FakeUploader };
