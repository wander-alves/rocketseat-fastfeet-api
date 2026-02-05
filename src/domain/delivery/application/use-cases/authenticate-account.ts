import { Either, left, right } from 'src/core/either';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';
import { CouriersRepository } from 'src/domain/delivery/application/repositories/couriers-repository';
import { InvalidCredentialsError } from 'src/domain/delivery/application/use-cases/errors/invalid-credentials-error';
import { Encrypter } from 'src/domain/delivery/application/cryptography/encrypter';
import { LogisticsSupportsRepository } from 'src/domain/delivery/application/repositories/logistics-supports-repository';
import { RecipientsRepository } from 'src/domain/delivery/application/repositories/recipients-repository';

interface AuthenticateAccountUseCaseRequest {
  governmentAccountId: GovernmentDocumentId;
  password: string;
}

type AuthenticateAccountUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    token: string;
  }
>;

type AccountRepository =
  | CouriersRepository
  | LogisticsSupportsRepository
  | RecipientsRepository;

export class AuthenticateAccountUseCase {
  constructor(
    private accountsRepository: AccountRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    governmentAccountId,
    password,
  }: AuthenticateAccountUseCaseRequest): Promise<AuthenticateAccountUseCaseResponse> {
    const registeredCourier =
      await this.accountsRepository.findByGovernmentId(governmentAccountId);

    if (!registeredCourier) {
      return left(new InvalidCredentialsError());
    }

    const passwordHash = await this.encrypter.generateHash(password);

    if (registeredCourier.password !== passwordHash) {
      return left(new InvalidCredentialsError());
    }

    const token = await this.encrypter.encrypt({
      sub: registeredCourier.id.value,
    });

    return right({
      token,
    });
  }
}
