import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';

import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';
import { Public } from '@/infra/authentication/public';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AuthenticateLogisticsSupportUseCase } from '@/domain/delivery/application/use-cases/authenticate-logistics-support';

const authenticationBodySchema = z.object({
  document: z.string(),
  password: z.string(),
});

type AuthenticationBody = z.infer<typeof authenticationBodySchema>;

const validationPipe = new ZodValidationPipe(authenticationBodySchema);

@Controller('/api/admin/signin')
class AuthenticateLogisticsSupportController {
  private useCase: AuthenticateLogisticsSupportUseCase;

  constructor(useCase: AuthenticateLogisticsSupportUseCase) {
    this.useCase = useCase;
  }

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: AuthenticationBody) {
    const { document, password } = body;
    const result = await this.useCase.execute({
      document,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case InvalidCredentialError:
          throw new UnauthorizedException();
        default:
          throw new BadRequestException();
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}

export { AuthenticateLogisticsSupportController };
