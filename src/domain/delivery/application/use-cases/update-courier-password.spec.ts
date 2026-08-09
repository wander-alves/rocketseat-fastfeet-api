import { describe, beforeEach, it, expect } from 'vitest';

import { UpdateCourierPasswordUseCase } from '@/domain/delivery/application/use-cases/update-courier-password';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryCouriersRepository } from '@/../tests/database/repositories/in-memory-couriers-repository';
import { FakeHasher } from '@/../tests/cryptography/fake-hasher';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

describe('[Unitary] Update Courier Password Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let couriersRepository: InMemoryCouriersRepository;
  let hasher: FakeHasher;
  let sut: UpdateCourierPasswordUseCase;
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

    sut = new UpdateCourierPasswordUseCase(
      logisticsSupportsRepository,
      couriersRepository,
      hasher,
    );
  });

  it('should be able to update courier password from admin account', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      courierId: courier.id.value,
      password: 'newpassword',
    });

    expect(result.isRight()).toBe(true);
    const updatedCourier = await couriersRepository.findOneById(
      courier.id.value,
    );

    expect(updatedCourier).toMatchObject({
      props: {
        password: await hasher.hash('newpassword'),
        updatedAt: expect.any(Date),
      },
    });
  });

  it('should not be able to update courier password from non admin account', async () => {
    const result = await sut.execute({
      logisticsSupportId: courier.id.value,
      courierId: courier.id.value,
      password: 'newpassword',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to update a password of non existent courier', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      courierId: 'invalid-id',
      password: 'newpassword',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
