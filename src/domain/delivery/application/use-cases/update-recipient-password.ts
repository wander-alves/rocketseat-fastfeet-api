import { Injectable } from '@nestjs/common';

import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface UpdateRecipientPasswordUseCaseRequest {
  logisticsSupportId: string;
  recipientId: string;
  password: string;
}

type UpdateRecipientPasswordUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
class UpdateRecipientPasswordUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private recipientsRepository: RecipientsRepository;
  private hasher: HashGenerator;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    recipientsRepository: RecipientsRepository,
    hasher: HashGenerator,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.recipientsRepository = recipientsRepository;
    this.hasher = hasher;
  }

  async execute({
    logisticsSupportId,
    recipientId,
    password,
  }: UpdateRecipientPasswordUseCaseRequest): Promise<UpdateRecipientPasswordUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findOneById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hasher.hash(password);

    recipient.password = hashedPassword;

    await this.recipientsRepository.save(recipient);

    return right(null);
  }
}

export { UpdateRecipientPasswordUseCase };
