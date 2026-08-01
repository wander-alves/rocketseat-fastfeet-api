import { Injectable } from '@nestjs/common';

import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface EditShipmentUseCaseRequest {
  logisticsSupportId: string;
  shipmentId: string;
  recipientId: string;
  name: string;
  street: string;
  addressNumber: number;
  neighborhood: string;
  state: string;
  zipcode: string;
}

type EditShipmentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    shipment: Shipment;
  }
>;

@Injectable()
class EditShipmentUseCase {
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
    shipmentId,
    recipientId,
    name,
    addressNumber,
    neighborhood,
    state,
    street,
    zipcode,
  }: EditShipmentUseCaseRequest): Promise<EditShipmentUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findOneById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    const shipment = await this.shipmentsRepository.findOneById(shipmentId);

    if (!shipment) {
      return left(new ResourceNotFoundError());
    }

    shipment.name = name;
    shipment.recipientId = new UniqueEntityID(recipientId);
    shipment.address.addressNumber = addressNumber;
    shipment.address.neighborhood = neighborhood;
    shipment.address.state = state;
    shipment.address.street = street;
    shipment.address.zipcode = zipcode;

    this.shipmentsRepository.save(shipment);

    return right({
      shipment,
    });
  }
}

export { EditShipmentUseCase };
