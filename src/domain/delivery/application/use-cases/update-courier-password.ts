import { Injectable } from '@nestjs/common';

import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface UpdateCourierPasswordUseCaseRequest {
  logisticsSupportId: string;
  courierId: string;
  password: string;
}

type UpdateCourierPasswordUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
class UpdateCourierPasswordUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private couriersRepository: CouriersRepository;
  private hasher: HashGenerator;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    couriersRepository: CouriersRepository,
    hasher: HashGenerator,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.couriersRepository = couriersRepository;
    this.hasher = hasher;
  }

  async execute({
    logisticsSupportId,
    courierId,
    password,
  }: UpdateCourierPasswordUseCaseRequest): Promise<UpdateCourierPasswordUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const courier = await this.couriersRepository.findOneById(courierId);

    if (!courier) {
      return left(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hasher.hash(password);

    courier.password = hashedPassword;

    await this.couriersRepository.save(courier);

    return right(null);
  }
}

export { UpdateCourierPasswordUseCase };
