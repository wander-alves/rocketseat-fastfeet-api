import { Injectable } from '@nestjs/common';

import { DeliveryProof } from '@/domain/delivery/enterprise/entities/delivery-proof';

import { DeliveryProofsRepository } from '@/domain/delivery/application/repositories/delivery-proofs-repository';
import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Uploader } from '../storage/uploader';

interface UploadDeliveryProofUseCaseRequest {
  shipmentId: string;
  courierId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadDeliveryProofUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    deliveryProof: DeliveryProof;
  }
>;

@Injectable()
class UploadDeliveryProofUseCase {
  private deliveryProofsRepository: DeliveryProofsRepository;
  private couriersRepository: CouriersRepository;
  private shipmentsRepository: ShipmentsRepository;
  private uploader: Uploader;

  constructor(
    deliveryProofsRepository: DeliveryProofsRepository,
    couriersRepository: CouriersRepository,
    shipmentsRepository: ShipmentsRepository,
    uploader: Uploader,
  ) {
    this.deliveryProofsRepository = deliveryProofsRepository;
    this.couriersRepository = couriersRepository;
    this.shipmentsRepository = shipmentsRepository;
    this.uploader = uploader;
  }

  async execute({
    shipmentId,
    courierId,
    fileName,
    fileType,
    body,
  }: UploadDeliveryProofUseCaseRequest): Promise<UploadDeliveryProofUseCaseResponse> {
    const VALID_ATTACHMENT_TYPES_REGEXP = new RegExp(
      /^(image\/(jpeg|png|webp))$/,
    );

    if (!VALID_ATTACHMENT_TYPES_REGEXP.test(fileType)) {
      return left(new NotAllowedError());
    }

    const doesCourierExists =
      await this.couriersRepository.findOneById(courierId);

    if (!doesCourierExists) {
      return left(new NotAllowedError());
    }

    const doesShipmentExists =
      await this.shipmentsRepository.findOneById(shipmentId);

    if (!doesShipmentExists) {
      return left(new ResourceNotFoundError());
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const deliveryProof = new DeliveryProof({
      title: fileName,
      url,
    });

    await this.deliveryProofsRepository.create(deliveryProof);

    return right({
      deliveryProof,
    });
  }
}

export { UploadDeliveryProofUseCase };
