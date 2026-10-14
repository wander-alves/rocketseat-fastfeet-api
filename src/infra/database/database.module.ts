import { Module } from '@nestjs/common';

import { EnvModule } from '@/infra/env/env.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { DeliveryProofsRepository } from '@/domain/delivery/application/repositories/delivery-proofs-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';

import { PrismaCouriersRepository } from '@/infra/database/prisma/repositories/prisma-couriers-repository';
import { PrismaDeliveryProofsRepository } from '@/infra/database/prisma/repositories/prisma-delivery-proofs-repository';
import { PrismaLogisticsSupportsRepository } from '@/infra/database/prisma/repositories/prisma-logistics-supports-repository';
import { PrismaRecipientsRepository } from '@/infra/database/prisma/repositories/prisma-recipients-repository';
import { PrismaShipmentsRepository } from './prisma/repositories/prisma-shipments-repository';

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: DeliveryProofsRepository,
      useClass: PrismaDeliveryProofsRepository,
    },
    {
      provide: LogisticsSupportsRepository,
      useClass: PrismaLogisticsSupportsRepository,
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
    CouriersRepository,
    DeliveryProofsRepository,
    LogisticsSupportsRepository,
    RecipientsRepository,
    ShipmentsRepository,
  ],
})
class DatabaseModule {}

export { DatabaseModule };
