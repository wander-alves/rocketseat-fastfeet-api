import { Injectable } from '@nestjs/common';

import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';

import { PrismaService } from '@/infra/database/prisma.service';
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper';

@Injectable()
class PrismaRecipientsRepository implements RecipientsRepository {
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

    const recipient = PrismaRecipientMapper.toDomain(user);

    return recipient;
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

    const recipient = PrismaRecipientMapper.toDomain(user);

    return recipient;
  }

  async create(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prismaService.user.create({
      data,
    });
  }
}

export { PrismaRecipientsRepository };
