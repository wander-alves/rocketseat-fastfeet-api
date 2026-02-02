import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

interface RecipientProps {
  name: string;
  governmentDocumentId: GovernmentDocumentId;
  password: string;
}

class Recipient extends Entity<RecipientProps> {
  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(
      {
        ...props,
      },
      id,
    );
    return recipient;
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

export { type RecipientProps, Recipient };
