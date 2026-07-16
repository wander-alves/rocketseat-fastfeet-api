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
import { RegisterShipmentController } from './controllers/register-shipment.controller';
import { RegisterShipmentUseCase } from '@/domain/delivery/application/use-cases/register-shipment';
import { DeleteCourierUseCase } from '@/domain/delivery/application/use-cases/delete-courier';
import { DeleteCourierController } from './controllers/delete-courier.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateCourierController,
    AuthenticateLogisticsSupportController,
    AuthenticateRecipientController,
    RegisterCourierController,
    DeleteCourierController,
    RegisterRecipientController,
    RegisterShipmentController,
  ],
  providers: [
    AuthenticateCourierUseCase,
    AuthenticateLogisticsSupportUseCase,
    AuthenticateRecipientUseCase,
    RegisterCourierUseCase,
    DeleteCourierUseCase,
    RegisterRecipientUseCase,
    RegisterShipmentUseCase,
  ],
})
class HttpModule {}

export { HttpModule };
