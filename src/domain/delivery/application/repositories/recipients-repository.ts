import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

export abstract class RecipientsRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findByGovernmentId(
    id: GovernmentDocumentId,
  ): Promise<Recipient | null>;
}
