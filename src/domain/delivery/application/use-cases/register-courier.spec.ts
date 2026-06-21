import { describe, beforeEach, it, expect } from 'vitest';

import { RegisterCourierUseCase } from '@/domain/delivery/application/use-cases/register-courier';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepositiory } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryCouriersRepositiory } from '@/../tests/database/repositories/in-memory-couriers-repository';
import { FakeEncrypter } from '@/../tests/cryptography/fake-encrypter';

import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';

describe('[Unitary] Register Courier Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepositiory;
  let couriersRepository: InMemoryCouriersRepositiory;
  let encrypter: FakeEncrypter;
  let sut: RegisterCourierUseCase;
  let logisticsSupport: LogisticsSupport;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepositiory();
    encrypter = new FakeEncrypter();

    logisticsSupport = new LogisticsSupport({
      name: 'master',
      password: 'ofputtets',
      documentID: new DocumentID('111.222.333-44'),
    });

    logisticsSupportsRepository.items.push(logisticsSupport);

    couriersRepository = new InMemoryCouriersRepositiory();
    sut = new RegisterCourierUseCase(
      logisticsSupportsRepository,
      couriersRepository,
      encrypter,
    );
  });

  it('should be able to register a courier with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
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
      logisticsSupportId: logisticsSupport.id.value,
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
      logisticsSupportId: logisticsSupport.id.value,
      name: 'John Doe',
      password: 'strong',
      document: '111.222.333-44',
    });

    const courier = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      name: 'Joseph Doe',
      password: 'strong',
      document: '111.222.333-44',
    });

    expect(courier.isLeft()).toBe(true);
    expect(courier.value).toBeInstanceOf(AlreadyRegisteredDocumentIDError);
    expect(couriersRepository.items).toHaveLength(1);
  });
});
