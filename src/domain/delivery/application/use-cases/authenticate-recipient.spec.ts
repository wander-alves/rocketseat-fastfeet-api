import { describe, beforeEach, it, expect } from 'vitest';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';
import { Recipient } from '../../enterprise/entities/recipient';
import { AuthenticateRecipientUseCase } from '@/domain/delivery/application/use-cases/authenticate-recipient';

import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';

import { FakeEncrypter } from '@/../tests/cryptography/fake-encrypter';
import { FakeHasher } from '@/../tests/cryptography/fake-hasher';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';

describe('[Unitary] Authenticate Recipient Use Case', () => {
  let recipientsRepository: InMemoryRecipientsRepository;
  let encrypter: FakeEncrypter;
  let hasher: FakeHasher;
  let sut: AuthenticateRecipientUseCase;

  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository();
    encrypter = new FakeEncrypter();
    hasher = new FakeHasher();
    sut = new AuthenticateRecipientUseCase(
      recipientsRepository,
      encrypter,
      hasher,
    );
  });

  it('should be able to authenticate a recipient account', async () => {
    const recipient = new Recipient(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await recipientsRepository.create(recipient);

    const result = await sut.execute({
      document: '111.222.333-44',
      password: 'strong',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { accessToken } = result.value;
      expect(JSON.parse(accessToken)).toMatchObject({
        sub: expect.any(String),
        role: 'RECIPIENT',
      });
    }
  });

  it('should not be able to authenticate a recipient account with invalid document', async () => {
    const recipient = new Recipient(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await recipientsRepository.create(recipient);

    const result = await sut.execute({
      document: '111.222.333-43',
      password: 'strong',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialError);
  });

  it('should not be able to authenticate a recipient account with invalid password', async () => {
    const recipient = new Recipient(
      {
        name: 'John Doe',
        password: await hasher.hash('strong'),
        documentID: new DocumentID('111.222.333-44'),
      },
      new UniqueEntityID('id-01'),
    );

    await recipientsRepository.create(recipient);

    const result = await sut.execute({
      document: '111.222.333-44',
      password: 'stronger',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialError);
  });
});
