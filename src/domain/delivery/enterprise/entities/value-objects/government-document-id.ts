type ValidatorType = 'cpf' | 'cnpj';

class GovernmentDocumentId {
  value: string;

  constructor(value: string, type: ValidatorType) {
    const validator = this.getValidator(type);

    if (!validator) {
      throw new Error('Invalid document type.');
    }

    if (!validator.test(value)) {
      throw new Error('Invalid ' + type.toUpperCase());
    }

    this.value = value;
  }

  private getValidator(type: ValidatorType): RegExp | undefined {
    const documentTypeValidator: Record<ValidatorType, RegExp> = {
      cpf: /^(\d{3})(\.)\1\2\1-\d{2}$/,
      cnpj: /^\d{2}(\.)\d{3}\1\d{3}\/\d{4}-\d{2}$/,
    };

    return documentTypeValidator[type];
  }
}

export { GovernmentDocumentId };
