import { Injectable } from '@nestjs/common';

import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';

import { PrismaService } from '@/infra/database/prisma.service';
import { PrismaLogisticsSupportMapper } from '@/infra/database/prisma/mappers/prisma-logistics-support-mapper';

@Injectable()
class PrismaLogisticsSupportsRepository implements LogisticsSupportsRepository {
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

    const logisticsSupport = PrismaLogisticsSupportMapper.toDomain(user);

    return logisticsSupport;
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

    const logisticsSupport = PrismaLogisticsSupportMapper.toDomain(user);

    return logisticsSupport;
  }

  async create(logisticsSupport: LogisticsSupport) {
    const data = PrismaLogisticsSupportMapper.toPrisma(logisticsSupport);

    await this.prismaService.user.create({
      data,
    });
  }
}

export { PrismaLogisticsSupportsRepository };
