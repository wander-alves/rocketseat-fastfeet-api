import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';

import { NestAuthenticateLogisticsSupportUseCase } from '../nest-use-cases/nest-authenticate-logistics-support';
import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';
import { Public } from '@/infra/authentication/public';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const authenticationBodySchema = z.object({
  document: z.string(),
  password: z.string(),
});

type AuthetnicationBodySchema = z.infer<typeof authenticationBodySchema>;

const validationPipe = new ZodValidationPipe(authenticationBodySchema);

@Controller('/admin/signin')
class AuthenticateLogisticsSupportController {
  private useCase: NestAuthenticateLogisticsSupportUseCase;

  constructor(useCase: NestAuthenticateLogisticsSupportUseCase) {
    this.useCase = useCase;
  }

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: AuthetnicationBodySchema) {
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
