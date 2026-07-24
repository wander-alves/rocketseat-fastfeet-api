import { describe, beforeEach, it, expect } from 'vitest';

import { EditCourierUseCase } from '@/domain/delivery/application/use-cases/edit-courier';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryCouriersRepository } from '@/../tests/database/repositories/in-memory-couriers-repository';
import { FakeHasher } from '@/../tests/cryptography/fake-hasher';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';

describe('[Unitary] Edit Courier Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let couriersRepository: InMemoryCouriersRepository;
  let hasher: FakeHasher;
  let sut: EditCourierUseCase;
  let logisticsSupport: LogisticsSupport;
  let courier: Courier;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    couriersRepository = new InMemoryCouriersRepository();
    hasher = new FakeHasher();

    logisticsSupport = new LogisticsSupport({
      name: 'admin01',
      password: 'admin01',
      documentID: new DocumentID('999.999.999-01'),
    });

    logisticsSupportsRepository.items.push(logisticsSupport);

    courier = new Courier({
      name: 'Jane Doe',
      password: 'strongone',
      documentID: new DocumentID('111.222.333-40'),
    });

    await couriersRepository.create(courier);

    sut = new EditCourierUseCase(
      logisticsSupportsRepository,
      couriersRepository,
      hasher,
    );
  });

  it('should be able to edit a courier with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      courierId: courier.id.value,
      name: courier.name,
      password: courier.password,
      document: '111.222.333-44',
    });

    expect(result.isRight()).toBe(true);
    const registeredCourier = await couriersRepository.findOneById(
      courier.id.value,
    );

    expect(registeredCourier).toMatchObject({
      props: {
        name: 'Jane Doe',
        documentID: {
          value: '111.222.333-44',
        },
      },
    });
  });

  it('should not be able to edit a courier without from non admin account', async () => {
    const result = await sut.execute({
      logisticsSupportId: courier.id.value,
      courierId: courier.id.value,
      name: courier.name,
      password: courier.password,
      document: '111.222.333-44',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit non existent courier', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      courierId: 'non-existent-id',
      name: courier.name,
      password: courier.password,
      document: '111.222.333-44',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a courier with already registered document', async () => {
    const newCourier = new Courier({
      name: 'John Doe',
      password: 'passphrase',
      documentID: new DocumentID('111.222.333-44'),
    });

    await couriersRepository.create(newCourier);

    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      courierId: courier.id.value,
      name: courier.name,
      password: courier.password,
      document: '111.222.333-44',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyRegisteredDocumentIDError);
  });

  it('should not be able to edit a courier with invalid document', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      courierId: courier.id.value,
      name: courier.name,
      password: courier.password,
      document: '000.000.000-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDocumentIDError);
  });
});
