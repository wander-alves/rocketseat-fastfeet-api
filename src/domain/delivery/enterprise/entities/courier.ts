import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

interface CourierProps {
  name: string;
  governmentDocumentId: GovernmentDocumentId;
  password: string;
}

class Courier extends Entity<CourierProps> {
  static create(props: CourierProps, id?: UniqueEntityID) {
    const courier = new Courier(
      {
        ...props,
      },
      id,
    );
    return courier;
  }

  get name() {
    return this.props.name;
  }

  get governmentDocumentId() {
    return this.props.governmentDocumentId;
  }

  get password() {
    return this.props.password;
  }
}

export { type CourierProps, Courier };
