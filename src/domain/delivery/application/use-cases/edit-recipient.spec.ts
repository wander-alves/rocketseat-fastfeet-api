import { describe, beforeEach, it, expect } from 'vitest';

import { EditRecipientUseCase } from '@/domain/delivery/application/use-cases/edit-recipient';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';

describe('[Unitary] Edit Recipient Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let sut: EditRecipientUseCase;
  let logisticsSupport: LogisticsSupport;
  let recipient: Recipient;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    recipientsRepository = new InMemoryRecipientsRepository();

    logisticsSupport = new LogisticsSupport({
      name: 'admin01',
      password: 'admin01',
      documentID: new DocumentID('999.999.999-01'),
    });

    logisticsSupportsRepository.items.push(logisticsSupport);

    recipient = new Recipient({
      name: 'Joseph Doe',
      password: 'strongone',
      documentID: new DocumentID('111.222.333-40'),
    });

    await recipientsRepository.create(recipient);

    sut = new EditRecipientUseCase(
      logisticsSupportsRepository,
      recipientsRepository,
    );
  });

  it('should be able to edit a recipient with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: recipient.id.value,
      name: 'Johnson Doe',
      document: '111.222.333-44',
    });

    expect(result.isRight()).toBe(true);
    const registeredRecipient = await recipientsRepository.findOneById(
      recipient.id.value,
    );

    expect(registeredRecipient).toMatchObject({
      props: {
        name: 'Johnson Doe',
        documentID: {
          value: '111.222.333-44',
        },
      },
    });
  });

  it('should not be able to edit a recipient from non admin account', async () => {
    const result = await sut.execute({
      logisticsSupportId: recipient.id.value,
      recipientId: recipient.id.value,
      name: recipient.name,
      document: '111.222.333-44',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit non existent recipient', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: 'non-existent-id',
      name: recipient.name,
      document: '111.222.333-44',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a recipient with already registered document', async () => {
    const newRecipient = new Recipient({
      name: 'John Doe',
      password: 'passphrase',
      documentID: new DocumentID('111.222.333-44'),
    });

    await recipientsRepository.create(newRecipient);

    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: recipient.id.value,
      name: recipient.name,
      document: '111.222.333-44',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyRegisteredDocumentIDError);
  });

  it('should not be able to edit a recipient with invalid document', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: recipient.id.value,
      name: recipient.name,
      document: '000.000.000-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDocumentIDError);
  });
});
