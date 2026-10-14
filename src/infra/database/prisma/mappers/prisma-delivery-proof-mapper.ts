import {
  Prisma,
  DeliveryProof as PrismaDeliveryProof,
} from '@/../prisma/generated/client/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeliveryProof } from '@/domain/delivery/enterprise/entities/delivery-proof';

class PrismaDeliveryProofMapper {
  static toDomain(raw: PrismaDeliveryProof): DeliveryProof {
    const deliveryproof = new DeliveryProof(
      {
        title: raw.title,
        url: raw.url,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );

    return deliveryproof;
  }

  static toPrisma(
    deliveryProof: DeliveryProof,
  ): Prisma.DeliveryProofUncheckedCreateInput {
    const prismaDeliveryProof: Prisma.DeliveryProofUncheckedCreateInput = {
      id: deliveryProof.id.value,
      title: deliveryProof.title,
      url: deliveryProof.url,
      createdAt: deliveryProof.createdAt,
    };

    return prismaDeliveryProof;
  }
}

export { PrismaDeliveryProofMapper };
