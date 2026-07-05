import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';
import { CourierPresenter } from '@/infra/http/presenters/courier-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { RegisterCourierUseCase } from '@/domain/delivery/application/use-cases/register-courier';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Roles, Role } from '@/infra/authentication/roles';

const registerCourierBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  document: z.string(),
});

type RegisterCourierBody = z.infer<typeof registerCourierBodySchema>;

const validationPipe = new ZodValidationPipe(registerCourierBodySchema);

@Controller('/api/accounts/couriers')
class RegisterCourierController {
  private useCase: RegisterCourierUseCase;

  constructor(useCase: RegisterCourierUseCase) {
    this.useCase = useCase;
  }

  @Post()
  @Roles(Role.ADMIN)
  async handle(
    @Body(validationPipe) body: RegisterCourierBody,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const { name, password, document } = body;

    const result = await this.useCase.execute({
      name,
      password,
      document,
      logisticsSupportId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case InvalidCredentialError:
          throw new UnauthorizedException(error.message);
        case AlreadyRegisteredDocumentIDError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { courier } = result.value;

    return {
      courier: CourierPresenter.toHTTP(courier),
    };
  }
}

export { RegisterCourierController };
