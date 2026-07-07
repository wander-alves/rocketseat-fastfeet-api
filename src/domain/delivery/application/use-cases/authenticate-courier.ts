import { Injectable } from '@nestjs/common';

import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';
import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer';

import { Either, left, right } from '@/core/either';
import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';

interface AuthenticateCourierUseCaseRequest {
  document: string;
  password: string;
}

type AuthenticateCourierUseCaseResponse = Either<
  InvalidCredentialError,
  {
    accessToken: string;
  }
>;

@Injectable()
class AuthenticateCourierUseCase {
  private couriersRepository: CouriersRepository;
  private encrypter: Encrypter;
  private hashComparer: HashComparer;

  constructor(
    couriersRepository: CouriersRepository,
    encrypter: Encrypter,
    hashComparer: HashComparer,
  ) {
    this.couriersRepository = couriersRepository;
    this.encrypter = encrypter;
    this.hashComparer = hashComparer;
  }

  async execute({
    document,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findOneByDocumentID(document);

    if (!courier) {
      return left(new InvalidCredentialError());
    }

    const doesPasswordMatch = await this.hashComparer.compare(
      password,
      courier.password,
    );

    if (!doesPasswordMatch) {
      return left(new InvalidCredentialError());
    }

    const role = courier.constructor.name.toUpperCase();

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.value,
      role,
    });

    return right({
      accessToken,
    });
  }
}
export { AuthenticateCourierUseCase };
