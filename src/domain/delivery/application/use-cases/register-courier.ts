import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { InvalidDocumentIDError } from './errors/invalid-document-id-error';
import { Encrypter } from '../cryptograpghy/encrypter';
import { CouriersRepositiory } from '../repositories/couriers-repository';
import { AlreadyRegisteredDocumentIDError } from './errors/already-registered-document-id-error';

interface RegisterCourierUseCaseRequest {
  name: string;
  document: string;
  password: string;
}

type RegisterCourierUseCaseResponse = Either<
  NotAllowedError | InvalidDocumentIDError,
  {
    courier: Courier;
  }
>;

class RegisterCourierUseCase {
  private couriersRepository: CouriersRepositiory;
  private encrypter: Encrypter;
  constructor(couriersRepository: CouriersRepositiory, encrypter: Encrypter) {
    this.couriersRepository = couriersRepository;
    this.encrypter = encrypter;
  }

  async execute({
    name,
    document,
    password,
  }: RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    if (!DocumentID.isValidCPF(document)) {
      return left(new InvalidDocumentIDError());
    }

    const documentID = new DocumentID(document);

    const alreadyExistentCourier =
      await this.couriersRepository.findOneByDocumentID(documentID);

    if (alreadyExistentCourier) {
      return left(new AlreadyRegisteredDocumentIDError());
    }

    const hashedPassword = await this.encrypter.hash(password);

    const courier = new Courier({
      name,
      documentID,
      password: hashedPassword,
    });

    await this.couriersRepository.create(courier);

    return right({
      courier,
    });
  }
}

export { RegisterCourierUseCase };
