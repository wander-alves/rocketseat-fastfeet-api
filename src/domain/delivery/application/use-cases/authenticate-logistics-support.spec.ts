import { describe, beforeEach, it, expect } from 'vitest';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { AuthenticateLogisticsSupportUseCase } from '@/domain/delivery/application/use-cases/authenticate-logistics-support';

import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';

import { FakeEncrypter } from '@/../tests/cryptography/fake-encrypter';
import { FakeHasher } from '@/../tests/cryptography/fake-hasher';
import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';

describe('[Unatary] Authenticate Logistics Support Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let encrypter: FakeEncrypter;
  let hasher: FakeHasher;
  let sut: AuthenticateLogisticsSupportUseCase;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    encrypter = new FakeEncrypter();
    hasher = new FakeHasher();
    sut = new AuthenticateLogisticsSupportUseCase(
      logisticsSupportsRepository,
      encrypter,
      hasher,
    );
  });

  it('should be able to authenticate a logistics support account', async () => {
    const logisticsSupport = new LogisticsSupport(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await logisticsSupportsRepository.create(logisticsSupport);

    const result = await sut.execute({
      document: '111.222.333-44',
      password: 'strong',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate a logistics support account with invalid document', async () => {
    const logisticsSupport = new LogisticsSupport(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await logisticsSupportsRepository.create(logisticsSupport);

    const result = await sut.execute({
      document: '111.222.333-43',
      password: 'strong',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialError);
  });

  it('should not be able to authenticate a logistics support account with invalid password', async () => {
    const logisticsSupport = new LogisticsSupport(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await logisticsSupportsRepository.create(logisticsSupport);

    const result = await sut.execute({
      document: '111.222.333-44',
      password: 'stronger',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialError);
  });
});
