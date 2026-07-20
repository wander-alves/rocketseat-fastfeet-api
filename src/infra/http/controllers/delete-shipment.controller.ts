import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';

import { DeleteShipmentUseCase } from '@/domain/delivery/application/use-cases/delete-shipment';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Roles, Role } from '@/infra/authentication/roles';

@Controller('/api/shipments/:id')
class DeleteShipmentController {
  private useCase: DeleteShipmentUseCase;

  constructor(useCase: DeleteShipmentUseCase) {
    this.useCase = useCase;
  }

  @Delete()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(
    @Param('id') shipmentId: string,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const result = await this.useCase.execute({
      logisticsSupportId: user.sub,
      shipmentId,
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

export { DeleteShipmentController };
