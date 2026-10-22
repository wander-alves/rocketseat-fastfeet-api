import { describe, beforeEach, it, expect } from 'vitest';

import { ReturnShipmentUseCase } from '@/domain/delivery/application/use-cases/return-shipment';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

import { InMemoryCouriersRepository } from '@/../tests/database/repositories/in-memory-couriers-repository';
import { InMemoryShipmentsRepository } from '@/../tests/database/repositories/in-memory-shipments-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

describe('[Unitary] Return Shipment Use Case', () => {
  let couriersRepository: InMemoryCouriersRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let shipmentsRepository: InMemoryShipmentsRepository;
  let sut: ReturnShipmentUseCase;
  let courier: Courier;
  let recipient: Recipient;
  let shipment: Shipment;

  beforeEach(async () => {
    couriersRepository = new InMemoryCouriersRepository();
    recipientsRepository = new InMemoryRecipientsRepository();
    shipmentsRepository = new InMemoryShipmentsRepository();

    courier = new Courier({
      name: 'master',
      password: 'ofputtets',
      documentID: new DocumentID('111.222.333-44'),
    });

    couriersRepository.items.push(courier);

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

    sut = new ReturnShipmentUseCase(couriersRepository, shipmentsRepository);
  });

  it('should be able to return a shipment from courier account', async () => {
    const result = await sut.execute({
      courierId: courier.id.value,
      shipmentId: shipment.id.value,
    });

    expect(result.isRight()).toBe(true);
    const registeredShipment = await shipmentsRepository.findOneById(
      shipment.id.value,
    );

    expect(registeredShipment).toMatchObject({
      props: {
        status: 'RETURNED',
      },
    });

    const registeredShipmentCreatedAt =
      registeredShipment?.createdAt.getTime() ?? 0;

    const registeredShipmentReturnedUpAt =
      registeredShipment?.returnedAt?.getTime() ?? 0;

    expect(registeredShipmentReturnedUpAt).toBeGreaterThan(
      registeredShipmentCreatedAt,
    );
  });

  it('should not be able to return a shipment from non courier account', async () => {
    const result = await sut.execute({
      courierId: recipient.id.value,
      shipmentId: shipment.id.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);

    const registeredShipment = await shipmentsRepository.findOneById(
      shipment.id.value,
    );

    expect(registeredShipment).toMatchObject({
      props: {
        status: 'WAITING',
      },
    });

    expect(registeredShipment?.pickedUpAt).toBeUndefined();
  });

  it('should not be able to return a non existent shipment', async () => {
    const result = await sut.execute({
      courierId: courier.id.value,
      shipmentId: 'non-existent-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
