import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { AuthenticateLogisticsSupportController } from '@/infra/http/controllers/authenticate-logistics-support.controller';
import { AuthenticateLogisticsSupportUseCase } from '@/domain/delivery/application/use-cases/authenticate-logistics-support';
import { RegisterCourierController } from '@/infra/http/controllers/register-courier.controller';
import { RegisterCourierUseCase } from '@/domain/delivery/application/use-cases/register-courier';
import { AuthenticateCourierController } from './controllers/authenticate-couriers.controller';
import { AuthenticateCourierUseCase } from '@/domain/delivery/application/use-cases/authenticate-courier';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateCourierController,
    AuthenticateLogisticsSupportController,
    RegisterCourierController,
  ],
  providers: [
    AuthenticateCourierUseCase,
    AuthenticateLogisticsSupportUseCase,
    RegisterCourierUseCase,
  ],
})
class HttpModule {}

export { HttpModule };
