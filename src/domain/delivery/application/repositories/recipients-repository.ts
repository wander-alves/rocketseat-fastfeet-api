import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

abstract class RecipientsRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findOneById(id: string): Promise<Recipient | null>;
  abstract findOneByDocumentID(documentID: string): Promise<Recipient | null>;
  abstract deleteOneById(id: string): Promise<void>;
  abstract save(recipient: Recipient): Promise<void>;
}

export { RecipientsRepository };
