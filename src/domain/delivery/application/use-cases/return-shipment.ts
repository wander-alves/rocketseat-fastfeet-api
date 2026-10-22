import { Injectable } from '@nestjs/common';

import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface ReturnShipmentUseCaseRequest {
  courierId: string;
  shipmentId: string;
}

type ReturnShipmentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    shipment: Shipment;
  }
>;

@Injectable()
class ReturnShipmentUseCase {
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
  }: ReturnShipmentUseCaseRequest): Promise<ReturnShipmentUseCaseResponse> {
    const courier = await this.couriersRepository.findOneById(courierId);

    if (!courier) {
      return left(new NotAllowedError());
    }

    const shipment = await this.shipmentsRepository.findOneById(shipmentId);

    if (!shipment) {
      return left(new ResourceNotFoundError());
    }

    const isShipmentStatusElegible = ['WAITING', 'PICKED_UP'].includes(
      shipment.status,
    );

    if (!isShipmentStatusElegible) {
      return left(new NotAllowedError());
    }

    shipment.status = 'RETURNED';
    shipment.returnedAt = new Date();

    await this.shipmentsRepository.save(shipment);

    return right({
      shipment,
    });
  }
}

export { ReturnShipmentUseCase };
