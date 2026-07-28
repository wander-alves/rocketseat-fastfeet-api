import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';
import { RecipientPresenter } from '@/infra/http/presenters/recipient-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { EditRecipientUseCase } from '@/domain/delivery/application/use-cases/edit-recipient';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Roles, Role } from '@/infra/authentication/roles';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';

const editRecipientBodySchema = z.object({
  name: z.string(),
  document: z.string(),
});

type EditRecipientBody = z.infer<typeof editRecipientBodySchema>;

const validationPipe = new ZodValidationPipe(editRecipientBodySchema);

@Controller('/api/accounts/recipients/:id')
class EditRecipientController {
  private useCase: EditRecipientUseCase;

  constructor(useCase: EditRecipientUseCase) {
    this.useCase = useCase;
  }

  @Put()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  async handle(
    @Body(validationPipe) body: EditRecipientBody,
    @Param('id') recipientId: string,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const { name, document } = body;

    const result = await this.useCase.execute({
      name,
      document,
      logisticsSupportId: user.sub,
      recipientId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case AlreadyRegisteredDocumentIDError:
          throw new ConflictException(error.message);
        case InvalidDocumentIDError:
          throw new BadRequestException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
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

export { EditRecipientController };
