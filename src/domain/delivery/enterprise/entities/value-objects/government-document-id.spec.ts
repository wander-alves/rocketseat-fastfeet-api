import { InvalidDocumentIdError } from 'src/domain/delivery/enterprise/entities/value-objects/errors/invalid-document-id-error';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';
import { describe, it, expect } from 'vitest';

describe('Value Object Government Document Id', () => {
  it('should generate an instance of an object when a valid CPF is provided.', () => {
    const result = new GovernmentDocumentId('123.123.123-22', 'cpf');

    expect(result.value).toEqual(expect.any(String));
  });
  it('should generate an instance of an object when a valid CNPJ is provided.', () => {
    const result = new GovernmentDocumentId('12.123.123/0001-22', 'cnpj');

    expect(result.value).toEqual(expect.any(String));
  });

  it('should not generate an instance of an object when an invalid document id is provided.', () => {
    expect(
      () => new GovernmentDocumentId('123.123.123=22', 'cpf'),
    ).toThrowError(InvalidDocumentIdError);
  });
  it('should not generate an instance of an object when an invalid document id is provided.', () => {
    expect(
      () => new GovernmentDocumentId('12.123.123/0000-22', 'cnpj'),
    ).toThrowError(InvalidDocumentIdError);
  });
});
