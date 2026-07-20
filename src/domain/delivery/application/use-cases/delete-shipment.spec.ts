import { describe, beforeEach, it, expect } from 'vitest';

import { DeleteShipmentUseCase } from '@/domain/delivery/application/use-cases/delete-shipment';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryShipmentsRepository } from '@/../tests/database/repositories/in-memory-shipments-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

describe('[Unitary] Delete Shipment Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let shipmentsRepository: InMemoryShipmentsRepository;
  let sut: DeleteShipmentUseCase;
  let logisticsSupport: LogisticsSupport;
  let recipient: Recipient;
  let shipment: Shipment;

  beforeEach(async () => {
    logisticsSupportsRepository = new InMemoryLogisticsSupportsRepository();
    recipientsRepository = new InMemoryRecipientsRepository();
    shipmentsRepository = new InMemoryShipmentsRepository();

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

    shipment = new Shipment({
      recipientId: recipient.id,
      name: 'Pacote 01',
      address: {
        street: 'Rua dos Bobos',
        addressNumber: 0,
        neighborhood: 'Vila Sesamo',
        state: 'GO',
        zipcode: '0000-000',
      },
    });

    shipmentsRepository.items.push(shipment);

    sut = new DeleteShipmentUseCase(
      logisticsSupportsRepository,
      shipmentsRepository,
    );
  });

  it('should be able to delete a shipment with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      shipmentId: shipment.id.value,
    });

    expect(result.isRight()).toBe(true);
    expect(shipmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a shipment with non administrative account', async () => {
    const result = await sut.execute({
      logisticsSupportId: recipient.id.value,
      shipmentId: shipment.id.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(shipmentsRepository.items).toHaveLength(1);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete non existent shipment', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      shipmentId: 'invalid-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(shipmentsRepository.items).toHaveLength(1);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
