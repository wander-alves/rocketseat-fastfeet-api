import { Injectable } from '@nestjs/common';

import { DeliveryProof } from '@/domain/delivery/enterprise/entities/delivery-proof';
import { DeliveryProofsRepository } from '@/domain/delivery/application/repositories/delivery-proofs-repository';

import { PrismaService } from '@/infra/database/prisma.service';
import { PrismaDeliveryProofMapper } from '@/infra/database/prisma/mappers/prisma-delivery-proof-mapper';

@Injectable()
class PrismaDeliveryProofsRepository implements DeliveryProofsRepository {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async findOneById(id: string) {
    const data = await this.prismaService.deliveryProof.findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      return null;
    }

    const deliveryProof = PrismaDeliveryProofMapper.toDomain(data);

    return deliveryProof;
  }

  async findOneByURL(url: string) {
    const data = await this.prismaService.deliveryProof.findFirst({
      where: {
        url,
      },
    });

    if (!data) {
      return null;
    }

    const deliveryProof = PrismaDeliveryProofMapper.toDomain(data);

    return deliveryProof;
  }

  async create(DeliveryProof: DeliveryProof) {
    const data = PrismaDeliveryProofMapper.toPrisma(DeliveryProof);

    await this.prismaService.deliveryProof.create({
      data,
    });
  }

  async deleteOneById(id: string) {
    await this.prismaService.deliveryProof.delete({
      where: {
        id,
      },
    });
  }
}

export { PrismaDeliveryProofsRepository };
