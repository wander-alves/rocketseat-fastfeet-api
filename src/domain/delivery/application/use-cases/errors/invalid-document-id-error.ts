import { UseCaseError } from '@/core/errors/use-case-error';

class InvalidDocumentIDError extends UseCaseError {
  constructor() {
    super('The provided document is invalid.');
  }
}

export { InvalidDocumentIDError };
