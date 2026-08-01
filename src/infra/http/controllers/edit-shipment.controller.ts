import {
  BadRequestException,
  Body,
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
import { ShipmentPresenter } from '@/infra/http/presenters/shipment-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { EditShipmentUseCase } from '@/domain/delivery/application/use-cases/edit-shipment';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Roles, Role } from '@/infra/authentication/roles';

const editShipmentBodySchema = z.object({
  recipientId: z.uuid(),
  name: z.string(),
  street: z.string().min(3).max(120),
  addressNumber: z.number().min(0).max(9999),
  neighborhood: z.string().min(3).max(120),
  state: z.string().min(2).max(2),
  zipcode: z.string().regex(/\d{4}[-]?\d{3}/),
});

type EditShipmentBody = z.infer<typeof editShipmentBodySchema>;

const validationPipe = new ZodValidationPipe(editShipmentBodySchema);

@Controller('/api/shipments/:id')
class EditShipmentController {
  private useCase: EditShipmentUseCase;

  constructor(useCase: EditShipmentUseCase) {
    this.useCase = useCase;
  }

  @Put()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  async handle(
    @Body(validationPipe) body: EditShipmentBody,
    @Param('id') shipmentId: string,
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
      shipmentId,
      logisticsSupportId: user.sub,
      recipientId,
      name,
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

export { EditShipmentController };
