import { RecipientsRepository } from 'src/domain/delivery/application/repositories/recipients-repository';
import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient);
  }

  async findByGovernmentId(
    id: GovernmentDocumentId,
  ): Promise<Recipient | null> {
    const recipient = this.items.find(
      (item) => item.governmentDocumentId === id,
    );

    if (!recipient) {
      return null;
    }

    return recipient;
  }
}
