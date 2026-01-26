import { randomUUID } from 'node:crypto';

export class UniqueEntityID {
  private _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  get value() {
    return this._value;
  }

  equals(uniqueEntityID: UniqueEntityID) {
    return this._value === uniqueEntityID.value;
  }
}
