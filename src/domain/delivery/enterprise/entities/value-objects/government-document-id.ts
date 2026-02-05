import { InvalidDocumentIdError } from 'src/domain/delivery/enterprise/entities/value-objects/errors/invalid-document-id-error';

type ValidatorType = 'cpf' | 'cnpj';

class GovernmentDocumentId {
  value: string;

  constructor(value: string, type: ValidatorType) {
    const validator = this.getValidator(type);

    if (!validator) {
      throw new InvalidDocumentIdError(type);
    }

    if (!validator.test(value)) {
      throw new InvalidDocumentIdError(type);
    }

    this.value = value;
  }

  private getValidator(type: ValidatorType): RegExp | undefined {
    const documentTypeValidator: Record<ValidatorType, RegExp> = {
      cpf: /^\d{3}(\.)\d{3}\1\d{3}-\d{2}$/,
      cnpj: /^[a-zA-Z0-9]{2}(\.)[a-zA-Z0-9]{3}\1[a-zA-Z0-9]{3}\/([a-zA-Z0-9]{3}[a-zA-Z1-9]|[a-zA-Z1-9]{3}[a-zA-Z0-9]{1})-[a-zA-Z0-9]{2}$/,
    };

    return documentTypeValidator[type];
  }
}

export { GovernmentDocumentId };
