import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    const httpRecipient = {
      id: recipient.id.value,
      name: recipient.name,
      document: recipient.documentID.value,
    };

    return httpRecipient;
  }
}

export { RecipientPresenter };
