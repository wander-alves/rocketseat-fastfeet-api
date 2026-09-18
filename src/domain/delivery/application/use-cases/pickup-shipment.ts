import { Injectable } from '@nestjs/common';

import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface PickupShipmentUseCaseRequest {
  courierId: string;
  shipmentId: string;
}

type PickupShipmentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    shipment: Shipment;
  }
>;

@Injectable()
class PickupShipmentUseCase {
  private couriersRepository: CouriersRepository;
  private shipmentsRepository: ShipmentsRepository;

  constructor(
    couriersRepository: CouriersRepository,
    shipmentsRepository: ShipmentsRepository,
  ) {
    this.couriersRepository = couriersRepository;
    this.shipmentsRepository = shipmentsRepository;
  }

  async execute({
    courierId,
    shipmentId,
  }: PickupShipmentUseCaseRequest): Promise<PickupShipmentUseCaseResponse> {
    const courier = await this.couriersRepository.findOneById(courierId);

    if (!courier) {
      return left(new NotAllowedError());
    }

    const shipment = await this.shipmentsRepository.findOneById(shipmentId);

    if (!shipment) {
      return left(new ResourceNotFoundError());
    }

    shipment.status = 'PICKED_UP';
    shipment.pickedUpAt = new Date();

    await this.shipmentsRepository.save(shipment);

    return right({
      shipment,
    });
  }
}

export { PickupShipmentUseCase };
