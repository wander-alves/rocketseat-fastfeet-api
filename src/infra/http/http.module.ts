import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { AuthenticateLogisticsSupportController } from '@/infra/http/controllers/authenticate-logistics-support.controller';
import { NestAuthenticateLogisticsSupportUseCase } from '@/infra/http/nest-use-cases/nest-authenticate-logistics-support';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateLogisticsSupportController],
  providers: [NestAuthenticateLogisticsSupportUseCase],
})
class HttpModule {}

export { HttpModule };
