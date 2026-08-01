import { describe, beforeEach, it, expect } from 'vitest';

import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';
import { FakeHasher } from '@/../tests/cryptography/fake-hasher';

import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

describe('[Unitary] Register Recipient Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let hasher: FakeHasher;
  let sut: RegisterRecipientUseCase;
  let logisticsSupport: LogisticsSupport;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    hasher = new FakeHasher();

    logisticsSupport = new LogisticsSupport({
      name: 'master',
      password: 'ofputtets',
      documentID: new DocumentID('111.222.333-44'),
    });

    logisticsSupportsRepository.items.push(logisticsSupport);

    recipientsRepository = new InMemoryRecipientsRepository();
    sut = new RegisterRecipientUseCase(
      logisticsSupportsRepository,
      recipientsRepository,
      hasher,
    );
  });

  it('should be able to register a recipient with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      name: 'John Doe',
      password: 'strong',
      document: '111.222.333-44',
    });

    expect(result.isRight()).toBe(true);
    expect(recipientsRepository.items).toHaveLength(1);
    expect(recipientsRepository.items[0]).toMatchObject({
      props: {
        name: 'John Doe',
        documentID: {
          value: '111.222.333-44',
        },
      },
    });
  });

  it('should not be able to register a recipient from non admin account', async () => {
    const recipient = await sut.execute({
      logisticsSupportId: 'invalid-id',
      name: 'Jane Doe',
      password: 'strong',
      document: '111.222.333-45',
    });

    expect(recipient.isLeft()).toBe(true);
    expect(recipient.value).toBeInstanceOf(NotAllowedError);
    expect(recipientsRepository.items).toHaveLength(0);
  });

  it('should not be able to register a recipient with invalid document', async () => {
    const recipient = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      name: 'Jane Doe',
      password: 'strong',
      document: '111.222.333-45',
    });

    expect(recipient.isLeft()).toBe(true);
    expect(recipient.value).toBeInstanceOf(InvalidDocumentIDError);
    expect(recipientsRepository.items).toHaveLength(0);
  });

  it('should not be able to register with duplicated document id', async () => {
    await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      name: 'John Doe',
      password: 'strong',
      document: '111.222.333-44',
    });

    const recipient = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      name: 'Joseph Doe',
      password: 'strong',
      document: '111.222.333-44',
    });

    expect(recipient.isLeft()).toBe(true);
    expect(recipient.value).toBeInstanceOf(AlreadyRegisteredDocumentIDError);
    expect(recipientsRepository.items).toHaveLength(1);
  });
});
