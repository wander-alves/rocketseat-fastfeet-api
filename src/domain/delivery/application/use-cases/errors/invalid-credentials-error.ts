export class InvalidCredentialsError extends Error {
  constructor() {
    super('The provided credentiails are invalid.');
  }
}
