import { Injectable } from '@nestjs/common';

import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';

interface RegisterRecipientUseCaseRequest {
  logisticsSupportId: string;
  name: string;
  document: string;
  password: string;
}

type RegisterRecipientUseCaseResponse = Either<
  NotAllowedError | InvalidDocumentIDError | AlreadyRegisteredDocumentIDError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
class RegisterRecipientUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private recipientsRepository: RecipientsRepository;
  private hashGenerator: HashGenerator;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    recipientsRepository: RecipientsRepository,
    hashGenerator: HashGenerator,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.recipientsRepository = recipientsRepository;
    this.hashGenerator = hashGenerator;
  }

  async execute({
    logisticsSupportId,
    name,
    document,
    password,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    if (!DocumentID.isValidCPF(document)) {
      return left(new InvalidDocumentIDError());
    }

    const documentID = new DocumentID(document);

    const alreadyExistentRecipient =
      await this.recipientsRepository.findOneByDocumentID(document);

    if (alreadyExistentRecipient) {
      return left(new AlreadyRegisteredDocumentIDError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const recipient = new Recipient({
      name,
      documentID,
      password: hashedPassword,
    });

    await this.recipientsRepository.create(recipient);

    return right({
      recipient,
    });
  }
}

export { RegisterRecipientUseCase };
