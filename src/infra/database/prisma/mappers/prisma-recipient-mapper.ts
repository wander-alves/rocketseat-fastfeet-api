import {
  Prisma,
  User as PrismaUser,
} from '@/../prisma/generated/client/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

class PrismaRecipientMapper {
  static toDomain(raw: PrismaUser): Recipient {
    const recipient = new Recipient(
      {
        name: raw.name,
        password: raw.password,
        documentID: new DocumentID(raw.documentID),
      },
      new UniqueEntityID(raw.id),
    );

    return recipient;
  }

  static toPrisma(recipient: Recipient): Prisma.UserUncheckedCreateInput {
    const user: Prisma.UserUncheckedCreateInput = {
      id: recipient.id.value,
      name: recipient.name,
      password: recipient.name,
      documentID: recipient.documentID.value,
      role: 'RECIPIENT',
    };

    return user;
  }
}

export { PrismaRecipientMapper };
