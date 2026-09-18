import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';

import { PickupShipmentUseCase } from '@/domain/delivery/application/use-cases/pickup-shipment';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Roles, Role } from '@/infra/authentication/roles';

@Controller('/api/shipments/:id/pickup')
class PickupShipmentController {
  private useCase: PickupShipmentUseCase;

  constructor(useCase: PickupShipmentUseCase) {
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

export { PickupShipmentController };
