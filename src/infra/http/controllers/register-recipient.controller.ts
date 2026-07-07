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
import { RecipientPresenter } from '@/infra/http/presenters/recipient-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Roles, Role } from '@/infra/authentication/roles';

const registerRecipientBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  document: z.string(),
});

type RegisterRecipientBody = z.infer<typeof registerRecipientBodySchema>;

const validationPipe = new ZodValidationPipe(registerRecipientBodySchema);

@Controller('/api/accounts/recipients')
class RegisterRecipientController {
  private useCase: RegisterRecipientUseCase;

  constructor(useCase: RegisterRecipientUseCase) {
    this.useCase = useCase;
  }

  @Post()
  @Roles(Role.ADMIN)
  async handle(
    @Body(validationPipe) body: RegisterRecipientBody,
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

    const { recipient } = result.value;

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    };
  }
}

export { RegisterRecipientController };
