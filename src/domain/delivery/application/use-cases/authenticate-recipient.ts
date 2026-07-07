import { Injectable } from '@nestjs/common';

import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';
import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer';

import { Either, left, right } from '@/core/either';
import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';

interface AuthenticateRecipientUseCaseRequest {
  document: string;
  password: string;
}

type AuthenticateRecipientUseCaseResponse = Either<
  InvalidCredentialError,
  {
    accessToken: string;
  }
>;

@Injectable()
class AuthenticateRecipientUseCase {
  private recipientsRepository: RecipientsRepository;
  private encrypter: Encrypter;
  private hashComparer: HashComparer;

  constructor(
    recipientsRepository: RecipientsRepository,
    encrypter: Encrypter,
    hashComparer: HashComparer,
  ) {
    this.recipientsRepository = recipientsRepository;
    this.encrypter = encrypter;
    this.hashComparer = hashComparer;
  }

  async execute({
    document,
    password,
  }: AuthenticateRecipientUseCaseRequest): Promise<AuthenticateRecipientUseCaseResponse> {
    const recipient =
      await this.recipientsRepository.findOneByDocumentID(document);

    if (!recipient) {
      return left(new InvalidCredentialError());
    }

    const doesPasswordMatch = await this.hashComparer.compare(
      password,
      recipient.password,
    );

    if (!doesPasswordMatch) {
      return left(new InvalidCredentialError());
    }

    const role = recipient.constructor.name.toUpperCase();

    const accessToken = await this.encrypter.encrypt({
      sub: recipient.id.value,
      role,
    });

    return right({
      accessToken,
    });
  }
}
export { AuthenticateRecipientUseCase };
