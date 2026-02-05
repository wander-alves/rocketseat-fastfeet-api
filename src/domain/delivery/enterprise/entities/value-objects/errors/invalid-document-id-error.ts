export class InvalidDocumentIdError extends Error {
  constructor(type: string) {
    super('Invalid ' + type.toUpperCase());
  }
}
