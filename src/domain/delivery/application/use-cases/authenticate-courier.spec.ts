import { describe, beforeEach, it, expect } from 'vitest';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { AuthenticateCourierUseCase } from '@/domain/delivery/application/use-cases/authenticate-courier';

import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';

import { FakeEncrypter } from '@/../tests/cryptography/fake-encrypter';
import { FakeHasher } from '@/../tests/cryptography/fake-hasher';
import { InMemoryCouriersRepository } from '@/../tests/database/repositories/in-memory-couriers-repository';

describe('[Unitary] Authenticate Courier Use Case', () => {
  let couriersRepository: InMemoryCouriersRepository;
  let encrypter: FakeEncrypter;
  let hasher: FakeHasher;
  let sut: AuthenticateCourierUseCase;

  beforeEach(async () => {
    couriersRepository = new InMemoryCouriersRepository();
    encrypter = new FakeEncrypter();
    hasher = new FakeHasher();
    sut = new AuthenticateCourierUseCase(couriersRepository, encrypter, hasher);
  });

  it('should be able to authenticate a courier account', async () => {
    const courier = new Courier(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await couriersRepository.create(courier);

    const result = await sut.execute({
      document: '111.222.333-44',
      password: 'strong',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { accessToken } = result.value;
      expect(JSON.parse(accessToken)).toMatchObject({
        sub: expect.any(String),
        role: 'COURIER',
      });
    }
  });

  it('should not be able to authenticate a courier account with invalid document', async () => {
    const courier = new Courier(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await couriersRepository.create(courier);

    const result = await sut.execute({
      document: '111.222.333-43',
      password: 'strong',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialError);
  });

  it('should not be able to authenticate a courier account with invalid password', async () => {
    const courier = new Courier(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await couriersRepository.create(courier);

    const result = await sut.execute({
      document: '111.222.333-44',
      password: 'stronger',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialError);
  });
});
