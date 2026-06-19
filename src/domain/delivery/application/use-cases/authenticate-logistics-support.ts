import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { LogisticsSupportsRepositiory } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';

import { Either, left, right } from '@/core/either';
import { InvalidCredentialError } from './errors/invalid-credential-error';

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

class AuthenticateLogisticsSupportUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepositiory;
  private encrypter: Encrypter;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepositiory,
    encrypter: Encrypter,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.encrypter = encrypter;
  }

  async execute({
    document,
    password,
  }: AuthenticateLogisticsSupportUseCaseRequest): Promise<AuthenticateLogisticsSupportUseCaseResponse> {
    const documentID = new DocumentID(document);

    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneByDocumentID(documentID);

    if (!logisticsSupport) {
      return left(new InvalidCredentialError());
    }

    const doesPasswordMatch = await this.encrypter.compare(
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
