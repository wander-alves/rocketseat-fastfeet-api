import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

import { AlreadyRegisteredDocumentIDError } from '@/domain/delivery/application/use-cases/errors/already-registered-document-id-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InvalidDocumentIDError } from '@/domain/delivery/application/use-cases/errors/invalid-document-id-error';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface RegisterCourierUseCaseRequest {
  logisticsSupportId: string;
  name: string;
  document: string;
  password: string;
}

type RegisterCourierUseCaseResponse = Either<
  NotAllowedError | InvalidDocumentIDError | AlreadyRegisteredDocumentIDError,
  {
    courier: Courier;
  }
>;

@Injectable()
class RegisterCourierUseCase {
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
    name,
    document,
    password,
  }: RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    const logisticsSupport =
      await this.logisticsSupportsRepository.findOneById(logisticsSupportId);

    if (!logisticsSupport) {
      return left(new NotAllowedError());
    }

    if (!DocumentID.isValidCPF(document)) {
      return left(new InvalidDocumentIDError());
    }

    const documentID = new DocumentID(document);

    const alreadyExistentCourier =
      await this.couriersRepository.findOneByDocumentID(document);

    if (alreadyExistentCourier) {
      return left(new AlreadyRegisteredDocumentIDError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

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
