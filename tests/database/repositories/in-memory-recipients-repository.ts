import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = [];

  async create(recipient: Recipient) {
    this.items.push(recipient);
  }

  async findOneById(id: string) {
    const recipient = this.items.find((item) => item.id.value === id);

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async findOneByDocumentID(documentID: string) {
    const recipient = this.items.find(
      (item) => item.documentID.value === documentID,
    );

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async deleteOneById(id: string) {
    const index = this.items.findIndex((item) => item.id.value === id);

    this.items.splice(index, 1);
  }
}

export { InMemoryRecipientsRepository };
