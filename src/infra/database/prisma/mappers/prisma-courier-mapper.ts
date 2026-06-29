import {
  Prisma,
  User as PrismaUser,
} from '@/../prisma/generated/client/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

class PrismaCourierMapper {
  static toDomain(raw: PrismaUser): Courier {
    const courier = new Courier(
      {
        name: raw.name,
        password: raw.password,
        documentID: new DocumentID(raw.documentID),
      },
      new UniqueEntityID(raw.id),
    );

    return courier;
  }

  static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    const user: Prisma.UserUncheckedCreateInput = {
      id: courier.id.value,
      name: courier.name,
      password: courier.name,
      documentID: courier.documentID.value,
      role: 'COURIER',
    };

    return user;
  }
}

export { PrismaCourierMapper };
