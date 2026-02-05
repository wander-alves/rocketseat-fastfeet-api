import { CouriersRepository } from 'src/domain/delivery/application/repositories/couriers-repository';
import { Courier } from 'src/domain/delivery/enterprise/entities/courier';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = [];

  async create(courier: Courier): Promise<void> {
    this.items.push(courier);
  }

  async findByGovernmentId(id: GovernmentDocumentId): Promise<Courier | null> {
    const courier = this.items.find((item) => item.governmentDocumentId === id);

    if (!courier) {
      return null;
    }

    return courier;
  }
}
