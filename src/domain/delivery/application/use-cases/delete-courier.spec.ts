import { describe, beforeEach, it, expect } from 'vitest';

import { DeleteCourierUseCase } from '@/domain/delivery/application/use-cases/delete-courier';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryCouriersRepository } from '@/../tests/database/repositories/in-memory-couriers-repository';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

describe('[Unitary] Delete Courier Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let couriersRepository: InMemoryCouriersRepository;
  let sut: DeleteCourierUseCase;
  let logisticsSupport: LogisticsSupport;
  let courier: Courier;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    couriersRepository = new InMemoryCouriersRepository();

    logisticsSupport = new LogisticsSupport({
      name: 'master',
      password: 'ofputtets',
      documentID: new DocumentID('111.222.333-44'),
    });

    logisticsSupportsRepository.items.push(logisticsSupport);

    courier = new Courier({
      name: 'Jane Doe',
      password: 'strongone',
      documentID: new DocumentID('111.222.333-45'),
    });

    couriersRepository.items.push(courier);

    sut = new DeleteCourierUseCase(
      logisticsSupportsRepository,
      couriersRepository,
    );
  });

  it('should be able to delete a courier with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      courierId: courier.id.value,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(null);
    expect(couriersRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a courier from unauthorized user', async () => {
    const result = await sut.execute({
      logisticsSupportId: courier.id.value,
      courierId: courier.id.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(couriersRepository.items).toHaveLength(1);
  });

  it('should not be able to delete a courier with inexistent id', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      courierId: 'invalid-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(couriersRepository.items).toHaveLength(1);
  });
});
