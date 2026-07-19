import { Injectable } from '@nestjs/common';

import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface DeleteRecipientUseCaseRequest {
  recipientId: string;
  logisticsSupportId: string;
}

type DeleteRecipientUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
class DeleteRecipientUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private recipientsRepository: RecipientsRepository;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    recipientsRepository: RecipientsRepository,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.recipientsRepository = recipientsRepository;
  }

  async execute({
    logisticsSupportId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const alreadyExistentRecipient =
      await this.recipientsRepository.findOneById(recipientId);

    if (!alreadyExistentRecipient) {
      return left(new ResourceNotFoundError());
    }

    await this.recipientsRepository.deleteOneById(
      alreadyExistentRecipient.id.value,
    );

    return right(null);
  }
}

export { DeleteRecipientUseCase };
