import { describe, beforeEach, it, expect } from 'vitest';

import { UpdateRecipientPasswordUseCase } from '@/domain/delivery/application/use-cases/update-recipient-password';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';
import { FakeHasher } from '@/../tests/cryptography/fake-hasher';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

describe('[Unitary] Update Recipient Password Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let hasher: FakeHasher;
  let sut: UpdateRecipientPasswordUseCase;
  let logisticsSupport: LogisticsSupport;
  let recipient: Recipient;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    recipientsRepository = new InMemoryRecipientsRepository();
    hasher = new FakeHasher();

    logisticsSupport = new LogisticsSupport({
      name: 'admin01',
      password: 'admin01',
      documentID: new DocumentID('999.999.999-01'),
    });

    logisticsSupportsRepository.items.push(logisticsSupport);

    recipient = new Recipient({
      name: 'Jane Doe',
      password: 'strongone',
      documentID: new DocumentID('111.222.333-40'),
    });

    await recipientsRepository.create(recipient);

    sut = new UpdateRecipientPasswordUseCase(
      logisticsSupportsRepository,
      recipientsRepository,
      hasher,
    );
  });

  it('should be able to update recipient password from admin account', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: recipient.id.value,
      password: 'newpassword',
    });

    expect(result.isRight()).toBe(true);
    const updatedRecipient = await recipientsRepository.findOneById(
      recipient.id.value,
    );

    expect(updatedRecipient).toMatchObject({
      props: {
        password: await hasher.hash('newpassword'),
        updatedAt: expect.any(Date),
      },
    });
  });

  it('should not be able to update recipient password from non admin account', async () => {
    const result = await sut.execute({
      logisticsSupportId: recipient.id.value,
      recipientId: recipient.id.value,
      password: 'newpassword',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to update a password of non existent recipient', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: 'invalid-id',
      password: 'newpassword',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
