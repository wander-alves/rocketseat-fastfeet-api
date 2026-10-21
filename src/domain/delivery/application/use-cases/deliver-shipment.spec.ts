import { describe, beforeEach, it, expect } from 'vitest';

import { DeliverShipmentUseCase } from '@/domain/delivery/application/use-cases/deliver-shipment';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';
import { DeliveryProof } from '@/domain/delivery/enterprise/entities/delivery-proof';

import { InMemoryCouriersRepository } from '@/../tests/database/repositories/in-memory-couriers-repository';
import { InMemoryShipmentsRepository } from '@/../tests/database/repositories/in-memory-shipments-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';
import { InMemoryDeliveryProofsRepository } from '@/../tests/database/repositories/in-memory-delivery-proofs-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliveryProofNotFoundError } from '@/domain/delivery/application/use-cases/errors/delivery-proof-not-found-error';

describe('[Unitary] Deliver Shipment Use Case', () => {
  let couriersRepository: InMemoryCouriersRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let shipmentsRepository: InMemoryShipmentsRepository;
  let deliveryProofsRepository: InMemoryDeliveryProofsRepository;
  let sut: DeliverShipmentUseCase;
  let courier: Courier;
  let recipient: Recipient;
  let shipment: Shipment;
  let deliveryProof: DeliveryProof;

  beforeEach(async () => {
    couriersRepository = new InMemoryCouriersRepository();
    recipientsRepository = new InMemoryRecipientsRepository();
    shipmentsRepository = new InMemoryShipmentsRepository();
    deliveryProofsRepository = new InMemoryDeliveryProofsRepository();

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
      status: 'PICKED_UP',
      pickedUpAt: new Date(),
      address: {
        street: 'Rua dos Bobos',
        addressNumber: 0,
        neighborhood: 'Vila Sesamo',
        state: 'GO',
        zipcode: '0000-000',
      },
    });

    shipmentsRepository.items.push(shipment);

    deliveryProof = new DeliveryProof({
      title: 'proof 01',
      url: 'http://example.com',
    });

    deliveryProofsRepository.create(deliveryProof);

    sut = new DeliverShipmentUseCase(
      couriersRepository,
      shipmentsRepository,
      deliveryProofsRepository,
    );
  });

  it('should be able to deliver a shipment from courier account', async () => {
    const result = await sut.execute({
      courierId: courier.id.value,
      shipmentId: shipment.id.value,
      deliveryProofId: deliveryProof.id.value,
    });

    expect(result.isRight()).toBe(true);
    const registeredShipment = await shipmentsRepository.findOneById(
      shipment.id.value,
    );

    expect(registeredShipment).toMatchObject({
      props: {
        status: 'DELIVERED',
      },
    });

    expect(registeredShipment?.deliveredAt?.getTime()).toBeGreaterThan(
      shipment.createdAt.getTime(),
    );
  });

  it('should not be able to deliver a shipment from a non courier account', async () => {
    const result = await sut.execute({
      courierId: 'invalid-id',
      shipmentId: shipment.id.value,
      deliveryProofId: deliveryProof.id.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);

    const registeredShipment = await shipmentsRepository.findOneById(
      shipment.id.value,
    );

    expect(registeredShipment).toMatchObject({
      props: {
        status: 'PICKED_UP',
      },
    });

    expect(registeredShipment?.deliveredAt).toBeFalsy();
  });

  it('should not be able to deliver a non existent shipment', async () => {
    const result = await sut.execute({
      courierId: courier.id.value,
      shipmentId: 'invalid-id',
      deliveryProofId: deliveryProof.id.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);

    const registeredShipment = await shipmentsRepository.findOneById(
      shipment.id.value,
    );

    expect(registeredShipment).toMatchObject({
      props: {
        status: 'PICKED_UP',
      },
    });

    expect(registeredShipment?.deliveredAt).toBeFalsy();
  });

  it('should not be able to deliver a shipment without a delivery proof', async () => {
    const result = await sut.execute({
      courierId: courier.id.value,
      shipmentId: shipment.id.value,
      deliveryProofId: 'invalid-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DeliveryProofNotFoundError);

    const registeredShipment = await shipmentsRepository.findOneById(
      shipment.id.value,
    );

    expect(registeredShipment).toMatchObject({
      props: {
        status: 'PICKED_UP',
      },
    });

    expect(registeredShipment?.deliveredAt).toBeFalsy();
  });
});
