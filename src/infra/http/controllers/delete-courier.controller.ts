import {
  Body,
  Controller,
  Delete,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Param,
  HttpCode,
} from '@nestjs/common';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';
import { Roles, Role } from '@/infra/authentication/roles';

import { DeleteCourierUseCase } from '@/domain/delivery/application/use-cases/delete-courier';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

@Controller('/api/accounts/couriers/:id')
class DeleteCourierController {
  private useCase: DeleteCourierUseCase;

  constructor(useCase: DeleteCourierUseCase) {
    this.useCase = useCase;
  }

  @Delete()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(
    @Param('id') courierId: string,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const result = await this.useCase.execute({
      logisticsSupportId: user.sub,
      courierId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}

export { DeleteCourierController };
