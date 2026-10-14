import { Module } from '@nestjs/common';

import { EnvModule } from '@/infra/env/env.module';
import { R2Storage } from '@/infra/storage/r2-storage.service';
import { Uploader } from '@/domain/delivery/application/storage/uploader';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
class StorageModule {}

export { StorageModule };
