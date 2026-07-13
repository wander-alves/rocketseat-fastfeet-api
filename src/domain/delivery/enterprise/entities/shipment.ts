import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

type IShipmentStatus = 'WAITING' | 'PICKED_UP' | 'DELIVERED' | 'RETURNED';

interface IAddress {
  street: string;
  addressNumber: number;
  neighborhood: string;
  state: string;
  zipcode: string;
}

interface IShipment {
  name: string;
  deliveryProofId?: UniqueEntityID | null;
  recipientId: UniqueEntityID;
  courierId?: UniqueEntityID | null;
  address: IAddress;
  status: IShipmentStatus;
  createdAt: Date;
  pickedUpAt?: Date | null;
  deliveredAt?: Date | null;
  returnedAt?: Date | null;
}

class Shipment extends Entity<IShipment> {
  constructor(
    props: Optional<IShipment, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    super(
      {
        ...props,
        status: props.status ?? 'WAITING',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get deliveryProofId() {
    return this.props.deliveryProofId;
  }

  set deliveryProofId(deliveryProofId: UniqueEntityID | undefined | null) {
    if (deliveryProofId === undefined) {
      this.props.deliveryProofId = null;
      return;
    }

    this.props.deliveryProofId = deliveryProofId;
  }

  get courierId() {
    return this.props.courierId;
  }

  set courierId(courierId: UniqueEntityID | undefined | null) {
    if (courierId === undefined) {
      this.props.courierId = null;
      return;
    }

    this.props.courierId = courierId;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  set recipientId(recipientId: UniqueEntityID) {
    this.props.recipientId = recipientId;
  }

  get address() {
    return this.props.address;
  }

  set address(address: IAddress) {
    this.props.address = address;
  }

  get status() {
    return this.props.status;
  }

  set status(status: IShipmentStatus) {
    this.props.status = status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get pickedUpAt() {
    return this.props.pickedUpAt;
  }

  set pickedUpAt(date: Date | undefined | null) {
    this.props.pickedUpAt = date;
  }

  get deliveredAt() {
    return this.props.deliveredAt;
  }

  set deliveredAt(date: Date | undefined | null) {
    this.props.deliveredAt = date;
  }

  get returnedAt() {
    return this.props.returnedAt;
  }

  set returnedAt(date: Date | undefined | null) {
    this.props.returnedAt = date;
  }
}

export { Shipment };
export type { IShipment, IShipmentStatus, IAddress };
