import {
  Prisma,
  Shipment as PrismaShipment,
} from '@/../prisma/generated/client/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

class PrismaShipmentMapper {
  static toDomain(raw: PrismaShipment): Shipment {
    const shipment = new Shipment(
      {
        name: raw.name,
        recipientId: new UniqueEntityID(raw.recipientId),
        courierId: raw.courierId ? new UniqueEntityID(raw.courierId) : null,
        deliveryProofId: raw.deliveryProofId
          ? new UniqueEntityID(raw.deliveryProofId)
          : null,
        status: raw.status,
        address: {
          street: raw.street,
          addressNumber: raw.addressNumber,
          neighborhood: raw.neighborhood,
          state: raw.state,
          zipcode: raw.zipcode,
        },
        createdAt: raw.createdAt,
        pickedUpAt: raw.pickedUpAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
      },
      new UniqueEntityID(raw.id),
    );

    return shipment;
  }

  static toPrisma(shipment: Shipment): Prisma.ShipmentUncheckedCreateInput {
    const prismaShipment: Prisma.ShipmentUncheckedCreateInput = {
      id: shipment.id.value,
      recipientId: shipment.recipientId.value,
      courierId: shipment.courierId?.value,
      deliveryProofId: shipment.deliveryProofId?.value,
      name: shipment.name,
      status: shipment.status,
      street: shipment.address.street,
      addressNumber: shipment.address.addressNumber,
      neighborhood: shipment.address.neighborhood,
      state: shipment.address.state,
      zipcode: shipment.address.zipcode,
      createdAt: shipment.createdAt,
      pickedUpAt: shipment.pickedUpAt,
      deliveredAt: shipment.deliveredAt,
      returnedAt: shipment.returnedAt,
    };

    return prismaShipment;
  }
}

export { PrismaShipmentMapper };
