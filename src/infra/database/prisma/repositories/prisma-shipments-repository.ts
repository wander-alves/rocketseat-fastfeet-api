import { Injectable } from '@nestjs/common';

import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';
import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';

import { PrismaService } from '@/infra/database/prisma.service';
import { PrismaShipmentMapper } from '@/infra/database/prisma/mappers/prisma-shipment-mapper';

@Injectable()
class PrismaShipmentsRepository implements ShipmentsRepository {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async findOneById(id: string) {
    const data = await this.prismaService.shipment.findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      return null;
    }

    const shipment = PrismaShipmentMapper.toDomain(data);

    return shipment;
  }

  async create(shipment: Shipment) {
    const data = PrismaShipmentMapper.toPrisma(shipment);

    await this.prismaService.shipment.create({
      data,
    });
  }

  async deleteOneById(id: string) {
    await this.prismaService.shipment.delete({
      where: {
        id,
      },
    });
  }
}

export { PrismaShipmentsRepository };
