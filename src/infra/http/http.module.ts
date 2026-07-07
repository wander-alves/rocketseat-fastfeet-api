import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { AuthenticateCourierUseCase } from '@/domain/delivery/application/use-cases/authenticate-courier';
import { AuthenticateLogisticsSupportUseCase } from '@/domain/delivery/application/use-cases/authenticate-logistics-support';
import { AuthenticateRecipientUseCase } from '@/domain/delivery/application/use-cases/authenticate-recipient';
import { RegisterCourierUseCase } from '@/domain/delivery/application/use-cases/register-courier';
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';

import { AuthenticateCourierController } from '@/infra/http/controllers/authenticate-courier.controller';
import { AuthenticateLogisticsSupportController } from '@/infra/http/controllers/authenticate-logistics-support.controller';
import { AuthenticateRecipientController } from '@/infra/http/controllers/authenticate-recipient.controller';
import { RegisterCourierController } from '@/infra/http/controllers/register-courier.controller';
import { RegisterRecipientController } from '@/infra/http/controllers/register-recipient.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateCourierController,
    AuthenticateLogisticsSupportController,
    AuthenticateRecipientController,
    RegisterCourierController,
    RegisterRecipientController,
  ],
  providers: [
    AuthenticateCourierUseCase,
    AuthenticateLogisticsSupportUseCase,
    AuthenticateRecipientUseCase,
    RegisterCourierUseCase,
    RegisterRecipientUseCase,
  ],
})
class HttpModule {}

export { HttpModule };
