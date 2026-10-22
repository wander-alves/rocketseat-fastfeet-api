import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';

import { ReturnShipmentUseCase } from '@/domain/delivery/application/use-cases/return-shipment';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Roles, Role } from '@/infra/authentication/roles';

@Controller('/api/shipments/:id/return')
class ReturnShipmentController {
  private useCase: ReturnShipmentUseCase;

  constructor(useCase: ReturnShipmentUseCase) {
    this.useCase = useCase;
  }

  @Patch()
  @HttpCode(204)
  @Roles(Role.COURIER)
  async handle(
    @Param('id') shipmentId: string,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const result = await this.useCase.execute({
      shipmentId,
      courierId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException();
        case ResourceNotFoundError:
          throw new NotFoundException();
        default:
          throw new BadRequestException();
      }
    }
  }
}

export { ReturnShipmentController };
