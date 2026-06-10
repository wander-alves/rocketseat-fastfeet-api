import { describe, beforeEach, it, expect } from 'vitest';

import { AuthenticateLogisticsSupportUseCase } from './authenticate-logistics-support-use-case';
import { InMemoryLogisticsSupportsRepositiory } from '../../../../../tests/database/repositories/in-memory-logistics-supports-repository';
import { FakeEncrypter } from '../../../../../tests/cryptography/fake-encrypter';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DocumentID } from '../../enterprise/entities/value-objects/document-id';
import { LogisticsSupport } from '../../enterprise/entities/logistics-support';
import { InvalidCredentialError } from './errors/invalid-credential-error';

describe('[Unitary] Authenticate Logistics Support Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepositiory;
  let encrypter: FakeEncrypter;
  let sut: AuthenticateLogisticsSupportUseCase;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepositiory();
    encrypter = new FakeEncrypter();
    sut = new AuthenticateLogisticsSupportUseCase(
      logisticsSupportsRepository,
      encrypter,
    );
  });

  it('should be able to authenticate a logistics support account', async () => {
    const logisticsSupport = new LogisticsSupport(
      {
        name: 'John Doe',
        password: await encrypter.hash('strong'),
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
        password: await encrypter.hash('strong'),
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
        password: await encrypter.hash('strong'),
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
