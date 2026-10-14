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
import { z } from 'zod';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';

import { DeliverShipmentUseCase } from '@/domain/delivery/application/use-cases/deliver-shipment';
import { Roles, Role } from '@/infra/authentication/roles';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliveryProofNotFoundError } from '@/domain/delivery/application/use-cases/errors/delivery-proof-not-found-error';

const deliverShipmentBodySchema = z.object({
  deliveryProofId: z.uuid(),
});

type DeliverShipmentBodySchema = z.infer<typeof deliverShipmentBodySchema>;

const deliverShipmentBodyValidationPipe = new ZodValidationPipe(
  deliverShipmentBodySchema,
);

@Controller('/api/shipments/:id/deliver')
class DeliverShipmentController {
  private useCase: DeliverShipmentUseCase;

  constructor(useCase: DeliverShipmentUseCase) {
    this.useCase = useCase;
  }

  @Patch()
  @HttpCode(204)
  @Roles(Role.COURIER)
  async handle(
    @Body(deliverShipmentBodyValidationPipe) body: DeliverShipmentBodySchema,
    @Param('id') shipmentId: string,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const { deliveryProofId } = body;

    const result = await this.useCase.execute({
      shipmentId,
      courierId: user.sub,
      deliveryProofId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException();
        case ResourceNotFoundError:
          throw new NotFoundException();
        case DeliveryProofNotFoundError:
          throw new ResourceNotFoundError();
        default:
          throw new BadRequestException();
      }
    }
  }
}

export { DeliverShipmentController };
