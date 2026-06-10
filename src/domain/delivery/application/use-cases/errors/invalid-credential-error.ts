import { UseCaseError } from '@/core/errors/use-case-error';

class InvalidCredentialError extends UseCaseError {
  constructor() {
    super('Invalid document id or password.');
  }
}

export { InvalidCredentialError };
