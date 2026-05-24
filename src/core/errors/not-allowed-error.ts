import { UseCaseError } from './use-case-error';

class NotAllowedError extends UseCaseError {
  constructor() {
    super('Action not allowed.');
  }
}

export { NotAllowedError };
