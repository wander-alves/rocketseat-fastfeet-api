import { UseCaseError } from './use-case-error';

class ResourceNotFoundError extends UseCaseError {
  constructor() {
    super('Resource not found.');
  }
}

export { ResourceNotFoundError };
