import { UniqueEntityID } from './unique-entity-id';

abstract class Entity<Props> {
  private _id: UniqueEntityID;
  protected props: Props;

  constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  public equals(entity: Entity<unknown>) {
    if (this === entity) {
      return true;
    }
    if (this.id.equals(entity.id)) {
      return true;
    }

    return false;
  }
}

export { Entity };
