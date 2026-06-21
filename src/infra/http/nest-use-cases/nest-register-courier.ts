import { Injectable } from '@nestjs/common';

import { RegisterCourierUseCase } from '@/domain/delivery/application/use-cases/register-courier';

@Injectable()
class NestRegisterCourierUseCase extends RegisterCourierUseCase {}

export { NestRegisterCourierUseCase };
