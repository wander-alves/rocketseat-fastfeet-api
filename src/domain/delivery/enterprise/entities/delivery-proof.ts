import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

interface IDeliveryProof {
  url: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

class DeliveryProof extends Entity<IDeliveryProof> {
  constructor(
    props: Optional<IDeliveryProof, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    super(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get url() {
    return this.props.url;
  }

  set url(url: string | null) {
    this.props.url = url;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
    this.touch();
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}

export { DeliveryProof };
export type { IDeliveryProof };
