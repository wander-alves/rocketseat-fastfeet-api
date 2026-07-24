import { Injectable } from '@nestjs/common';

import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

import { Either, left, right } from '@/core/either';
import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';

interface EditCourierUseCaseRequest {
  logisticsSupportId: string;
  courierId: string;
  name: string;
  document: string;
  password: string;
}

type EditCourierUseCaseResponse = Either<
  | NotAllowedError
  | InvalidDocumentIDError
  | AlreadyRegisteredDocumentIDError
  | ResourceNotFoundError,
  {
    courier: Courier;
  }
>;

@Injectable()
class EditCourierUseCase {
  private logisticsSupportsRepository: LogisticsSupportsRepository;
  private couriersRepository: CouriersRepository;
  private hashGenerator: HashGenerator;

  constructor(
    logisticsSupportsRepository: LogisticsSupportsRepository,
    couriersRepository: CouriersRepository,
    hashGenerator: HashGenerator,
  ) {
    this.logisticsSupportsRepository = logisticsSupportsRepository;
    this.couriersRepository = couriersRepository;
    this.hashGenerator = hashGenerator;
  }

  async execute({
    logisticsSupportId,
    courierId,
    name,
    document,
    password,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    const courier = await this.couriersRepository.findOneById(courierId);

    if (!courier) {
      return left(new ResourceNotFoundError());
    }

    if (!DocumentID.isValidCPF(document)) {
      return left(new InvalidDocumentIDError());
    }

    const alreadyExistentCourier =
      await this.couriersRepository.findOneByDocumentID(document);

    if (
      alreadyExistentCourier &&
      alreadyExistentCourier.id.value !== courierId
    ) {
      return left(new AlreadyRegisteredDocumentIDError());
    }

    const documentID = new DocumentID(document);

    courier.name = name ?? courier.name;
    courier.documentID = documentID ?? courier.documentID;

    const hashedPassword = password
      ? await this.hashGenerator.hash(password)
      : courier.password;
    courier.password = hashedPassword;

    await this.couriersRepository.save(courier);

    return right({
      courier,
    });
  }
}

export { EditCourierUseCase };
