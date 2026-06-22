import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { AuthenticateLogisticsSupportController } from '@/infra/http/controllers/authenticate-logistics-support.controller';
import { AuthenticateLogisticsSupportUseCase } from '@/domain/delivery/application/use-cases/authenticate-logistics-support';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateLogisticsSupportController],
  providers: [AuthenticateLogisticsSupportUseCase],
})
class HttpModule {}

export { HttpModule };
