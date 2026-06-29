import {
  Prisma,
  User as PrismaUser,
} from '@/../prisma/generated/client/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

class PrismaLogisticsSupportMapper {
  static toDomain(raw: PrismaUser): LogisticsSupport {
    const logisticsSupport = new LogisticsSupport(
      {
        name: raw.name,
        password: raw.password,
        documentID: new DocumentID(raw.documentID),
      },
      new UniqueEntityID(raw.id),
    );

    return logisticsSupport;
  }

  static toPrisma(
    logisticsSupport: LogisticsSupport,
  ): Prisma.UserUncheckedCreateInput {
    const user: Prisma.UserUncheckedCreateInput = {
      id: logisticsSupport.id.value,
      name: logisticsSupport.name,
      password: logisticsSupport.name,
      documentID: logisticsSupport.documentID.value,
      role: 'LOGISTICS_SUPPORT',
    };

    return user;
  }
}

export { PrismaLogisticsSupportMapper };
