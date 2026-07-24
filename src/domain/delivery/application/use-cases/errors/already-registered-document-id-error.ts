import { UseCaseError } from '@/core/errors/use-case-error';

class AlreadyRegisteredDocumentIDError extends UseCaseError {
  constructor() {
    super('This document id is invalid.');
  }
}

export { AlreadyRegisteredDocumentIDError };
