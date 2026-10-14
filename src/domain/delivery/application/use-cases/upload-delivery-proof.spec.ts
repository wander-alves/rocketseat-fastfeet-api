import { describe, beforeEach, it, expect } from 'vitest';

import { UploadDeliveryProofUseCase } from '@/domain/delivery/application/use-cases/upload-delivery-proof';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { InMemoryDeliveryProofsRepository } from '@/../tests/database/repositories/in-memory-delivery-proofs-repository';
import { InMemoryCouriersRepository } from '@/../tests/database/repositories/in-memory-couriers-repository';
import { InMemoryShipmentsRepository } from '@/../tests/database/repositories/in-memory-shipments-repository';
import { InMemoryRecipientsRepository } from '@/../tests/database/repositories/in-memory-recipients-repository';
import { FakeUploader } from '@/../tests/storage/fake-uploader';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

describe('[Unitary] Upload Delivery Proof Use Case', () => {
  let deliveryProofsRepository: InMemoryDeliveryProofsRepository;
  let couriersRepository: InMemoryCouriersRepository;
  let recipientsRepository: InMemoryRecipientsRepository;
  let shipmentsRepository: InMemoryShipmentsRepository;
  let uploader: FakeUploader;
  let sut: UploadDeliveryProofUseCase;
  let courier: Courier;
  let recipient: Recipient;
  let shipment: Shipment;

  beforeEach(async () => {
    deliveryProofsRepository = new InMemoryDeliveryProofsRepository();
    couriersRepository = new InMemoryCouriersRepository();
    recipientsRepository = new InMemoryRecipientsRepository();
    shipmentsRepository = new InMemoryShipmentsRepository();
    uploader = new FakeUploader();

    courier = new Courier({
      name: 'hermes',
      password: 'themessenger',
      documentID: new DocumentID('111.222.333-45'),
    });

    couriersRepository.items.push(courier);

    recipient = new Recipient({
      name: 'hades',
      password: 'thiswarmiskillingme',
      documentID: new DocumentID('111.222.333-46'),
    });

    recipientsRepository.items.push(recipient);

    shipment = new Shipment({
      recipientId: recipient.id,
      courierId: courier.id,
      status: 'PICKED_UP',
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

    sut = new UploadDeliveryProofUseCase(
      deliveryProofsRepository,
      couriersRepository,
      shipmentsRepository,
      uploader,
    );
  });

  it('should be able to upload a delivery proof with valid data', async () => {
    const result = await sut.execute({
      shipmentId: shipment.id.value,
      courierId: courier.id.value,
      fileName: 'attachment-01',
      fileType: 'image/png',
      body: Buffer.from('string'),
    });

    expect(result.isRight()).toBe(true);
    expect(deliveryProofsRepository.items).toHaveLength(1);
    expect(deliveryProofsRepository.items[0]).toMatchObject({
      props: expect.objectContaining({
        title: 'attachment-01',
      }),
    });
  });

  it('should not be able to upload a delivery proof with non existent shipment', async () => {
    const result = await sut.execute({
      shipmentId: 'invalid-id',
      courierId: courier.id.value,
      fileName: 'attachment-01',
      fileType: 'image/png',
      body: Buffer.from('image binary'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(deliveryProofsRepository.items).toHaveLength(0);
  });

  it('should not be able to upload a delivery proof from non courier account', async () => {
    const result = await sut.execute({
      shipmentId: shipment.id.value,
      courierId: 'invalid-id',
      fileName: 'attachment-01',
      fileType: 'image/png',
      body: Buffer.from('image binary'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(deliveryProofsRepository.items).toHaveLength(0);
  });

  it('should not be able to upload a delivery proof with invalid file type', async () => {
    const result = await sut.execute({
      shipmentId: shipment.id.value,
      courierId: courier.id.value,
      fileName: 'attachment-01',
      fileType: 'application/pdf',
      body: Buffer.from('image binary'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(deliveryProofsRepository.items).toHaveLength(0);
  });
});
