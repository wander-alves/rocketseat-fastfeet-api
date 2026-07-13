import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';
import { ShipmentPresenter } from '@/infra/http/presenters/shipment-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { RegisterShipmentUseCase } from '@/domain/delivery/application/use-cases/register-shipment';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Roles, Role } from '@/infra/authentication/roles';

const registerShipmentBodySchema = z.object({
  name: z.string(),
  recipientId: z.uuid(),
  street: z.string().min(3).max(120),
  addressNumber: z.number().min(0).max(9999),
  neighborhood: z.string().min(3).max(120),
  state: z.string().min(2).max(2),
  zipcode: z.string().regex(/\d{4}[-]?\d{3}/),
});

type RegisterShipmentBody = z.infer<typeof registerShipmentBodySchema>;

const validationPipe = new ZodValidationPipe(registerShipmentBodySchema);

@Controller('/api/shipments')
class RegisterShipmentController {
  private useCase: RegisterShipmentUseCase;

  constructor(useCase: RegisterShipmentUseCase) {
    this.useCase = useCase;
  }

  @Post()
  @Roles(Role.ADMIN)
  async handle(
    @Body(validationPipe) body: RegisterShipmentBody,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const {
      name,
      recipientId,
      street,
      addressNumber,
      neighborhood,
      state,
      zipcode,
    } = body;

    const result = await this.useCase.execute({
      name,
      logisticsSupportId: user.sub,
      recipientId,
      street,
      addressNumber,
      neighborhood,
      state,
      zipcode,
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

    const { shipment } = result.value;

    return {
      shipment: ShipmentPresenter.toHTTP(shipment),
    };
  }
}

export { RegisterShipmentController };
