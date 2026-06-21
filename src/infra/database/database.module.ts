import { Module } from '@nestjs/common';

import { EnvModule } from '@/infra/env/env.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { PrismaLogisticsSupportsRepository } from '@/infra/database/prisma/repositories/prisma-logistics-supports-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: LogisticsSupportsRepository,
      useClass: PrismaLogisticsSupportsRepository,
    },
  ],
  exports: [PrismaService, LogisticsSupportsRepository],
})
class DatabaseModule {}

export { DatabaseModule };
