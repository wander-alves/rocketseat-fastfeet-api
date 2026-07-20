import { Injectable } from '@nestjs/common';

import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface DeleteShipmentUseCaseRequest {
  shipmentId: string;
  logisticsSupportId: string;
}

type DeleteShipmentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
class DeleteShipmentUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private shipmentsRepository: ShipmentsRepository;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    shipmentsRepository: ShipmentsRepository,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.shipmentsRepository = shipmentsRepository;
  }

  async execute({
    shipmentId,
    logisticsSupportId,
  }: DeleteShipmentUseCaseRequest): Promise<DeleteShipmentUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const alreadyExistentShipment =
      await this.shipmentsRepository.findOneById(shipmentId);

    if (!alreadyExistentShipment) {
      return left(new ResourceNotFoundError());
    }

    await this.shipmentsRepository.deleteOneById(shipmentId);

    return right(null);
  }
}

export { DeleteShipmentUseCase };
