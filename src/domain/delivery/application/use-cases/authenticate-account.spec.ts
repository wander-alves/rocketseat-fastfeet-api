import { AuthenticateAccountUseCase } from 'src/domain/delivery/application/use-cases/authenticate-account';
import { InvalidCredentialsError } from 'src/domain/delivery/application/use-cases/errors/invalid-credentials-error';
import { Courier } from 'src/domain/delivery/enterprise/entities/courier';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository';
import { describe, beforeEach, it, expect } from 'vitest';

describe('Authenticate Account Use Case', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository;
  let fakeEncrypter: FakeEncrypter;
  let sut: AuthenticateAccountUseCase;
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateAccountUseCase(
      inMemoryCouriersRepository,
      fakeEncrypter,
    );
  });
  it('should authenticate an account with correct credentials', async () => {
    const courier = Courier.create({
      name: 'John Doe',
      governmentDocumentId: new GovernmentDocumentId('123.123.123-23', 'cpf'),
      password: await fakeEncrypter.generateHash('strongpassword'),
    });

    inMemoryCouriersRepository.create(courier);

    const result = await sut.execute({
      governmentAccountId: courier.governmentDocumentId,
      password: 'strongpassword',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      token: expect.any(String),
    });
  });

  it('should not authenticate an account with wrong credentials', async () => {
    const courier = Courier.create({
      name: 'John Doe',
      governmentDocumentId: new GovernmentDocumentId('123.123.123-23', 'cpf'),
      password: await fakeEncrypter.generateHash('strongpassword'),
    });

    inMemoryCouriersRepository.create(courier);

    const result = await sut.execute({
      governmentAccountId: courier.governmentDocumentId,
      password: 'wrongpassword',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
