import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

class ShipmentPresenter {
  static toHTTP(shipment: Shipment) {
    const httpShipment = {
      id: shipment.id.value,
      recipientId: shipment.recipientId,
      name: shipment.name,
      street: shipment.address.street,
      addressNumber: shipment.address.addressNumber,
      neighborhood: shipment.address.neighborhood,
      state: shipment.address.state,
      zipcode: shipment.address.zipcode,
      status: shipment.status,
      createdAt: shipment.createdAt,
      pickedUpAt: shipment.pickedUpAt,
      deliveredAt: shipment.deliveredAt,
      returnedAt: shipment.returnedAt,
    };

    return httpShipment;
  }
}

export { ShipmentPresenter };
