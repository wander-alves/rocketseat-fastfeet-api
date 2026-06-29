import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { AuthenticateLogisticsSupportController } from '@/infra/http/controllers/authenticate-logistics-support.controller';
import { AuthenticateLogisticsSupportUseCase } from '@/domain/delivery/application/use-cases/authenticate-logistics-support';
import { RegisterCourierController } from '@/infra/http/controllers/register-courier.controller';
import { RegisterCourierUseCase } from '@/domain/delivery/application/use-cases/register-courier';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateLogisticsSupportController,
    RegisterCourierController,
  ],
  providers: [AuthenticateLogisticsSupportUseCase, RegisterCourierUseCase],
})
class HttpModule {}

export { HttpModule };
