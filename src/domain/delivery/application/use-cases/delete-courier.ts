import { Injectable } from '@nestjs/common';

import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface DeleteCourierUseCaseRequest {
  courierId: string;
  logisticsSupportId: string;
}

type DeleteCourierUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
class DeleteCourierUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private couriersRepository: CouriersRepository;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    couriersRepository: CouriersRepository,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.couriersRepository = couriersRepository;
  }

  async execute({
    logisticsSupportId,
    courierId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const alreadyExistentCourier =
      await this.couriersRepository.findOneById(courierId);

    if (!alreadyExistentCourier) {
      return left(new ResourceNotFoundError());
    }

    await this.couriersRepository.deleteOneById(
      alreadyExistentCourier.id.value,
    );

    return right(null);
  }
}

export { DeleteCourierUseCase };
