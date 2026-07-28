import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { AuthenticateCourierUseCase } from '@/domain/delivery/application/use-cases/authenticate-courier';
import { AuthenticateLogisticsSupportUseCase } from '@/domain/delivery/application/use-cases/authenticate-logistics-support';
import { AuthenticateRecipientUseCase } from '@/domain/delivery/application/use-cases/authenticate-recipient';
import { DeleteCourierUseCase } from '@/domain/delivery/application/use-cases/delete-courier';
import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/delete-recipient';
import { DeleteShipmentUseCase } from '@/domain/delivery/application/use-cases/delete-shipment';
import { RegisterCourierUseCase } from '@/domain/delivery/application/use-cases/register-courier';
import { EditCourierUseCase } from '@/domain/delivery/application/use-cases/edit-courier';
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';
import { RegisterShipmentUseCase } from '@/domain/delivery/application/use-cases/register-shipment';

import { AuthenticateCourierController } from '@/infra/http/controllers/authenticate-courier.controller';
import { AuthenticateLogisticsSupportController } from '@/infra/http/controllers/authenticate-logistics-support.controller';
import { AuthenticateRecipientController } from '@/infra/http/controllers/authenticate-recipient.controller';
import { DeleteCourierController } from '@/infra/http/controllers/delete-courier.controller';
import { DeleteRecipientController } from '@/infra/http/controllers/delete-recipient.controller';
import { DeleteShipmentController } from '@/infra/http/controllers/delete-shipment.controller';
import { EditCourierController } from '@/infra/http/controllers/edit-courier.controller';
import { RegisterCourierController } from '@/infra/http/controllers/register-courier.controller';
import { RegisterRecipientController } from '@/infra/http/controllers/register-recipient.controller';
import { RegisterShipmentController } from '@/infra/http/controllers/register-shipment.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateCourierController,
    AuthenticateLogisticsSupportController,
    AuthenticateRecipientController,
    RegisterCourierController,
    DeleteCourierController,
    DeleteRecipientController,
    DeleteShipmentController,
    EditCourierController,
    RegisterRecipientController,
    RegisterShipmentController,
  ],
  providers: [
    AuthenticateCourierUseCase,
    AuthenticateLogisticsSupportUseCase,
    AuthenticateRecipientUseCase,
    DeleteCourierUseCase,
    DeleteRecipientUseCase,
    DeleteShipmentUseCase,
    EditCourierUseCase,
    RegisterCourierUseCase,
    RegisterRecipientUseCase,
    RegisterShipmentUseCase,
  ],
})
class HttpModule {}

export { HttpModule };
