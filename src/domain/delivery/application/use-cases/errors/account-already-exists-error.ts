export class AccountAlreadyExistsError extends Error {
  constructor() {
    super('This account is already registered.');
  }
}
