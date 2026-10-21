interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

interface UploaderResult {
  url: string;
}

abstract class Uploader {
  abstract upload(params: UploadParams): Promise<UploaderResult>;
}

export { Uploader };
export type { UploadParams };
