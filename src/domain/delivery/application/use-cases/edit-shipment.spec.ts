import { describe, beforeEach, it, expect } from 'vitest';

import { EditShipmentUseCase } from '@/domain/delivery/application/use-cases/edit-shipment';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryLogisticsSupportsRepository } from '@/../tests/database/repositories/in-memory-logistics-supports-repository';
import { InMemoryShipmentsRepository } from '@/../tests/database/repositories/in-memory-shipments-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

describe('[Unitary] Edit Shipment Use Case', () => {
  let logisticsSupportsRepository: InMemoryLogisticsSupportsRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let shipmentsRepository: InMemoryShipmentsRepository;
  let sut: EditShipmentUseCase;
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
      name: 'Pacote 01',
      recipientId: recipient.id,
      address: {
        street: 'Rua dos Bobos',
        addressNumber: 0,
        neighborhood: 'Vila Sesamo',
        state: 'GO',
        zipcode: '0000-000',
      },
    });

    shipmentsRepository.items.push(shipment);

    sut = new EditShipmentUseCase(
      logisticsSupportsRepository,
      recipientsRepository,
      shipmentsRepository,
    );
  });

  it('should be able to edit a shipment with valid data', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: recipient.id.value,
      shipmentId: shipment.id.value,
      name: 'New Package',
      street: 'Rua dos bobos',
      addressNumber: 20,
      neighborhood: 'Zoo',
      state: 'RS',
      zipcode: '0000-000',
    });

    expect(result.isRight()).toBe(true);
    const registeredShipment = await shipmentsRepository.findOneById(
      shipment.id.value,
    );

    expect(registeredShipment).toMatchObject({
      props: {
        name: 'New Package',
      },
    });
  });

  it('should not be able to edit a shipment from non admin account', async () => {
    const result = await sut.execute({
      logisticsSupportId: 'non-existent-id',
      recipientId: recipient.id.value,
      shipmentId: shipment.id.value,
      name: 'New Package',
      street: 'Rua dos bobos',
      addressNumber: 20,
      neighborhood: 'Zoo',
      state: 'RS',
      zipcode: '0000-000',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit shipment with invalid recipient id', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: 'non-existent-id',
      shipmentId: shipment.id.value,
      name: 'New Package',
      street: 'Rua dos bobos',
      addressNumber: 20,
      neighborhood: 'Zoo',
      state: 'RS',
      zipcode: '0000-000',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit non existent shipment', async () => {
    const result = await sut.execute({
      logisticsSupportId: logisticsSupport.id.value,
      recipientId: recipient.id.value,
      shipmentId: 'non-existent-id',
      name: 'New Package',
      street: 'Rua dos bobos',
      addressNumber: 20,
      neighborhood: 'Zoo',
      state: 'RS',
      zipcode: '0000-000',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
