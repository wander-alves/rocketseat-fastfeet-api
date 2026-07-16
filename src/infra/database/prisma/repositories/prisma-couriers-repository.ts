import { Injectable } from '@nestjs/common';

import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';

import { PrismaService } from '@/infra/database/prisma.service';
import { PrismaCourierMapper } from '@/infra/database/prisma/mappers/prisma-courier-mapper';

@Injectable()
class PrismaCouriersRepository implements CouriersRepository {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async findOneById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    const courier = PrismaCourierMapper.toDomain(user);

    return courier;
  }

  async findOneByDocumentID(documentID: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        documentID,
      },
    });

    if (!user) {
      return null;
    }

    const courier = PrismaCourierMapper.toDomain(user);

    return courier;
  }

  async create(courier: Courier) {
    const data = PrismaCourierMapper.toPrisma(courier);

    await this.prismaService.user.create({
      data,
    });
  }

  async deleteOneById(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}

export { PrismaCouriersRepository };
