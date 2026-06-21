import { Injectable } from '@nestjs/common';

import { AuthenticateLogisticsSupportUseCase } from '@/domain/delivery/application/use-cases/authenticate-logistics-support';

@Injectable()
class NestAuthenticateLogisticsSupportUseCase extends AuthenticateLogisticsSupportUseCase {}

export { NestAuthenticateLogisticsSupportUseCase };
