import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

interface ShipmentProps {
  courierId?: UniqueEntityID;
  recipientId?: UniqueEntityID;
  deliveryProofId?: UniqueEntityID;
  status: 'pending' | 'withdrawn' | 'delivered' | 'returned';
}

class Shipment extends Entity<ShipmentProps> {
  static create(props: ShipmentProps, id?: UniqueEntityID) {
    const shipment = new Shipment(
      {
        ...props,
      },
      id,
    );

    return shipment;
  }
}

export { type ShipmentProps, Shipment };
