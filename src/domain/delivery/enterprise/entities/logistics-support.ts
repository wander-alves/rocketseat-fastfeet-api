import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

interface LogisticsSupportProps {
  name: string;
  governmentDocumentId: GovernmentDocumentId;
  password: string;
}

class LogisticsSupport extends Entity<LogisticsSupportProps> {
  static create(props: LogisticsSupportProps, id?: UniqueEntityID) {
    const logisticsSupport = new LogisticsSupport(
      {
        ...props,
      },
      id,
    );
    return logisticsSupport;
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

export { type LogisticsSupportProps, LogisticsSupport };
