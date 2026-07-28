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
import { CourierPresenter } from '@/infra/http/presenters/courier-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { EditCourierUseCase } from '@/domain/delivery/application/use-cases/edit-courier';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Roles, Role } from '@/infra/authentication/roles';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';

const editCourierBodySchema = z.object({
  name: z.string(),
  document: z.string(),
});

type EditCourierBody = z.infer<typeof editCourierBodySchema>;

const validationPipe = new ZodValidationPipe(editCourierBodySchema);

@Controller('/api/accounts/couriers/:id')
class EditCourierController {
  private useCase: EditCourierUseCase;

  constructor(useCase: EditCourierUseCase) {
    this.useCase = useCase;
  }

  @Put()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  async handle(
    @Body(validationPipe) body: EditCourierBody,
    @Param('id') courierId: string,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const { name, document } = body;

    const result = await this.useCase.execute({
      name,
      document,
      logisticsSupportId: user.sub,
      courierId,
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

    const { courier } = result.value;

    return {
      courier: CourierPresenter.toHTTP(courier),
    };
  }
}

export { EditCourierController };
