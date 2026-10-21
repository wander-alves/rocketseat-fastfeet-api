import { UseCaseError } from '@/core/errors/use-case-error';

class DeliveryProofNotFoundError extends UseCaseError {
  constructor() {
    super('A delivery proof must be provided.');
  }
}

export { DeliveryProofNotFoundError };
