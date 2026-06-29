import { randomUUID } from 'node:crypto';

class UniqueEntityID {
  private _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  get value() {
    return this._value;
  }

  equals(id: UniqueEntityID) {
    return id.value === this.value;
  }
}

export { UniqueEntityID };
