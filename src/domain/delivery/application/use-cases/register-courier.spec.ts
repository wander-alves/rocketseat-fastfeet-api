import { describe, beforeEach, it, expect } from 'vitest';
import { RegisterCourierUseCase } from './register-courier';

import { InMemoryCouriersRepositiory } from '../../../../../tests/database/repositories/in-memory-couriers-repository';
import { FakeEncrypter } from '../../../../../tests/cryptography/fake-encrypter';

import { InvalidDocumentIDError } from './errors/invalid-document-id-error';
import { AlreadyRegisteredDocumentIDError } from './errors/already-registered-document-id-error';

describe('[Unitary] Register Courier', () => {
  let couriersRepository: InMemoryCouriersRepositiory;
  let encrypter: FakeEncrypter;
  let sut: RegisterCourierUseCase;

  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepositiory();
    encrypter = new FakeEncrypter();
    sut = new RegisterCourierUseCase(couriersRepository, encrypter);
  });
  it('should be able to register a courier with valid data', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      password: 'strong',
      document: '111.222.333-44',
    });

    expect(result.isRight()).toBe(true);
    expect(couriersRepository.items).toHaveLength(1);
    expect(couriersRepository.items[0]).toMatchObject({
      props: {
        name: 'John Doe',
        documentID: {
          value: '111.222.333-44',
        },
      },
    });
  });

  it('should not be able to register a courier with invalid document', async () => {
    const courier = await sut.execute({
      name: 'Jane Doe',
      password: 'strong',
      document: '111.222.333-45',
    });

    expect(courier.isLeft()).toBe(true);
    expect(courier.value).toBeInstanceOf(InvalidDocumentIDError);
    expect(couriersRepository.items).toHaveLength(0);
  });

  it('should not be able to register with duplicated document id', async () => {
    await sut.execute({
      name: 'John Doe',
      password: 'strong',
      document: '111.222.333-44',
    });

    const courier = await sut.execute({
      name: 'Joseph Doe',
      password: 'strong',
      document: '111.222.333-44',
    });

    expect(courier.isLeft()).toBe(true);
    expect(courier.value).toBeInstanceOf(AlreadyRegisteredDocumentIDError);
    expect(couriersRepository.items).toHaveLength(1);
  });
});
