import { Module } from '@nestjs/common';

import { EnvModule } from '@/infra/env/env.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';

import { PrismaLogisticsSupportsRepository } from '@/infra/database/prisma/repositories/prisma-logistics-supports-repository';
import { PrismaCouriersRepository } from '@/infra/database/prisma/repositories/prisma-couriers-repository';
import { PrismaRecipientsRepository } from '@/infra/database/prisma/repositories/prisma-recipients-repository';
import { PrismaShipmentsRepository } from './prisma/repositories/prisma-shipments-repository';

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: LogisticsSupportsRepository,
      useClass: PrismaLogisticsSupportsRepository,
    },
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: ShipmentsRepository,
      useClass: PrismaShipmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    LogisticsSupportsRepository,
    CouriersRepository,
    RecipientsRepository,
    ShipmentsRepository,
  ],
})
class DatabaseModule {}

export { DatabaseModule };
