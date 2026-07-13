import { Injectable } from '@nestjs/common';

import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface RegisterShipmentUseCaseRequest {
  logisticsSupportId: string;
  recipientId: string;
  name: string;
  street: string;
  addressNumber: number;
  neighborhood: string;
  state: string;
  zipcode: string;
}

type RegisterShipmentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    shipment: Shipment;
  }
>;

@Injectable()
class RegisterShipmentUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private recipientsRepository: RecipientsRepository;
  private shipmentsRepository: ShipmentsRepository;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    recipientsRepository: RecipientsRepository,
    shipmentsRepository: ShipmentsRepository,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.recipientsRepository = recipientsRepository;
    this.shipmentsRepository = shipmentsRepository;
  }

  async execute({
    logisticsSupportId,
    name,
    addressNumber,
    neighborhood,
    recipientId,
    state,
    street,
    zipcode,
  }: RegisterShipmentUseCaseRequest): Promise<RegisterShipmentUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findOneById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    const shipment = new Shipment({
      name,
      recipientId: new UniqueEntityID(recipientId),
      address: {
        addressNumber,
        neighborhood,
        state,
        street,
        zipcode,
      },
    });

    await this.shipmentsRepository.create(shipment);

    return right({
      shipment,
    });
  }
}

export { RegisterShipmentUseCase };
