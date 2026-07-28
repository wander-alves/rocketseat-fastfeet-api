import { Injectable } from '@nestjs/common';

import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

import { Either, left, right } from '@/core/either';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';

interface EditRecipientUseCaseRequest {
  logisticsSupportId: string;
  recipientId: string;
  name: string;
  document: string;
}

type EditRecipientUseCaseResponse = Either<
  | NotAllowedError
  | InvalidDocumentIDError
  | AlreadyRegisteredDocumentIDError
  | ResourceNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
class EditRecipientUseCase {
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
    recipientId,
    name,
    document,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findOneById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    if (!DocumentID.isValidCPF(document)) {
      return left(new InvalidDocumentIDError());
    }

    const alreadyExistentRecipient =
      await this.recipientsRepository.findOneByDocumentID(document);

    if (
      alreadyExistentRecipient &&
      alreadyExistentRecipient.id.value !== recipientId
    ) {
      return left(new AlreadyRegisteredDocumentIDError());
    }

    const documentID = new DocumentID(document);

    recipient.name = name ?? recipient.name;
    recipient.documentID = documentID ?? recipient.documentID;

    await this.recipientsRepository.save(recipient);

    return right({
      recipient,
    });
  }
}

export { EditRecipientUseCase };
