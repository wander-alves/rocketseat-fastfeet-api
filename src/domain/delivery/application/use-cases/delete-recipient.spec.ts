import { describe, beforeEach, it, expect } from 'vitest';

import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/delete-recipient';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

describe('[Unitary] Delete Recipient Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let sut: DeleteRecipientUseCase;
  let logisticsSupport: LogisticsSupport;
  let recipient: Recipient;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    recipientsRepository = new InMemoryRecipientsRepository();

    logisticsSupport = new LogisticsSupport({
      name: 'master',
      password: 'ofputtets',
      documentID: new DocumentID('111.222.333-44'),
    });

    logisticsSupportsRepository.items.push(logisticsSupport);

    recipient = new Recipient({
      name: 'Jane Doe',
      password: 'strongone',
      documentID: new DocumentID('111.222.333-45'),
    });

    recipientsRepository.items.push(recipient);

    sut = new DeleteRecipientUseCase(
      logisticsSupportsRepository,
      recipientsRepository,
    );
  });

  it('should be able to delete a recipient with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: recipient.id.value,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(null);
    expect(recipientsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a recipient from unauthorized user', async () => {
    const result = await sut.execute({
      logisticsSupportId: recipient.id.value,
      recipientId: recipient.id.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(recipientsRepository.items).toHaveLength(1);
  });

  it('should not be able to delete a recipient with inexistent id', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: 'invalid-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(recipientsRepository.items).toHaveLength(1);
  });
});
