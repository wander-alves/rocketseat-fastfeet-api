import { describe, beforeEach, it, expect } from 'vitest';

import { RegisterShipmentUseCase } from '@/domain/delivery/application/use-cases/register-shipment';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryShipmentsRepository } from '@/../tests/database/repositories/in-memory-shipments-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

describe('[Unitary] Register Shipment Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let shipmentsRepository: InMemoryShipmentsRepository;
  let sut: RegisterShipmentUseCase;
  let logisticsSupport: LogisticsSupport;
  let recipient: Recipient;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    recipientsRepository = new InMemoryRecipientsRepository();

    logisticsSupport = new LogisticsSupport({
      name: 'master',
      password: 'ofputtets',
      documentID: new DocumentID('111.222.333-44'),
    });

    logisticsSupportsRepository.items.push(logisticsSupport);

    recipient = new Recipient({
      name: 'Gambino',
      password: 'worstperson',
      documentID: new DocumentID('111.222.333-45'),
    });

    recipientsRepository.items.push(recipient);

    shipmentsRepository = new InMemoryShipmentsRepository();
    sut = new RegisterShipmentUseCase(
      logisticsSupportsRepository,
      recipientsRepository,
      shipmentsRepository,
    );
  });

  it('should be able to register a shipment with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: recipient.id.value,
      name: 'Pacote 01',
      street: 'Rua dos Bobos',
      addressNumber: 0,
      neighborhood: 'Vila Sesamo',
      state: 'GO',
      zipcode: '0000-000',
    });

    expect(result.isRight()).toBe(true);
    expect(shipmentsRepository.items).toHaveLength(1);
    expect(shipmentsRepository.items[0]).toMatchObject({
      props: {
        name: 'Pacote 01',
        status: 'WAITING',
      },
    });
  });

  it('should not be able to register a shipment with non administrative account', async () => {
    const result = await sut.execute({
      logisticsSupportId: recipient.id.value,
      recipientId: recipient.id.value,
      name: 'Pacote 01',
      street: 'Rua dos Bobos',
      addressNumber: 0,
      neighborhood: 'Vila Sesamo',
      state: 'GO',
      zipcode: '0000-000',
    });

    expect(result.isLeft()).toBe(true);
    expect(shipmentsRepository.items).toHaveLength(0);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
