import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export abstract class Entity<Props> {
  protected props: Props;
  private _id: UniqueEntityID;

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID();
  }

  get id() {
    return this._id;
  }

  equals(entity: Entity<Props>) {
    if (entity === this || this._id.equals(entity.id)) {
      return true;
    }
    return false;
  }
}
