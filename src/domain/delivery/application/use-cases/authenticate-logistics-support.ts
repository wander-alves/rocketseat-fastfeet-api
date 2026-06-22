import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';

import { Either, left, right } from '@/core/either';
import { InvalidCredentialError } from '@/domain/delivery/application/use-cases/errors/invalid-credential-error';
import { HashComparer } from '../cryptography/hash-comparer';
import { Injectable } from '@nestjs/common';

interface AuthenticateLogisticsSupportUseCaseRequest {
  document: string;
  password: string;
}

type AuthenticateLogisticsSupportUseCaseResponse = Either<
  InvalidCredentialError,
  {
    accessToken: string;
  }
>;

@Injectable()
class AuthenticateLogisticsSupportUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private encrypter: Encrypter;
  private hashComparer: HashComparer;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    encrypter: Encrypter,
    hashComparer: HashComparer,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.encrypter = encrypter;
    this.hashComparer = hashComparer;
  }

  async execute({
    document,
    password,
  }: AuthenticateLogisticsSupportUseCaseRequest): Promise<AuthenticateLogisticsSupportUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneByDocumentID(document);

    if (!logisticsSupport) {
      return left(new InvalidCredentialError());
    }

    const doesPasswordMatch = await this.hashComparer.compare(
      password,
      logisticsSupport.password,
    );

    if (!doesPasswordMatch) {
      return left(new InvalidCredentialError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: logisticsSupport.id.value,
    });

    return right({
      accessToken,
    });
  }
}

export { AuthenticateLogisticsSupportUseCase };
