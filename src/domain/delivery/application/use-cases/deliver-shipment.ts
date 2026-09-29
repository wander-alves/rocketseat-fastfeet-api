import { Injectable } from '@nestjs/common';

import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { DeliveryProofsRepository } from '@/domain/delivery/application/repositories/delivery-proofs-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliveryProofNotFoundError } from '@/domain/delivery/application/use-cases/errors/delivery-proof-not-found-error';

interface DeliverShipmentUseCaseRequest {
  courierId: string;
  shipmentId: string;
  deliveryProofId: string;
}

type DeliverShipmentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    shipment: Shipment;
  }
>;

@Injectable()
class DeliverShipmentUseCase {
  private couriersRepository: CouriersRepository;
  private shipmentsRepository: ShipmentsRepository;
  private deliveryProofsRepository: DeliveryProofsRepository;

  constructor(
    couriersRepository: CouriersRepository,
    shipmentsRepository: ShipmentsRepository,
    deliveryProofsRepository: DeliveryProofsRepository,
  ) {
    this.couriersRepository = couriersRepository;
    this.shipmentsRepository = shipmentsRepository;
    this.deliveryProofsRepository = deliveryProofsRepository;
  }

  async execute({
    courierId,
    shipmentId,
    deliveryProofId,
  }: DeliverShipmentUseCaseRequest): Promise<DeliverShipmentUseCaseResponse> {
    const courier = await this.couriersRepository.findOneById(courierId);

    if (!courier) {
      return left(new NotAllowedError());
    }

    const shipment = await this.shipmentsRepository.findOneById(shipmentId);

    if (!shipment) {
      return left(new ResourceNotFoundError());
    }

    const deliveryProof =
      await this.deliveryProofsRepository.findOneById(deliveryProofId);

    if (!deliveryProof) {
      return left(new DeliveryProofNotFoundError());
    }

    if (shipment.status !== 'PICKED_UP') {
      return left(new NotAllowedError());
    }

    shipment.status = 'DELIVERED';
    shipment.deliveredAt = new Date();
    shipment.deliveryProofId = new UniqueEntityID(deliveryProofId);

    await this.shipmentsRepository.save(shipment);

    return right({
      shipment,
    });
  }
}

export { DeliverShipmentUseCase };
