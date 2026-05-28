import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DocumentID } from './value-objects/document-id';
import { Optional } from '@/core/types/optional';

interface ILogisticsSupport {
  name: string;
  documentID: DocumentID;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

class LogisticsSupport extends Entity<ILogisticsSupport> {
  constructor(
    props: Optional<ILogisticsSupport, 'createdAt'>,
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

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get documentID() {
    return this.props.documentID;
  }

  set documentID(documentID: DocumentID) {
    this.props.documentID = documentID;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
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

export { LogisticsSupport };
