import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository';
import { Courier } from '@/domain/delivery/enterprise/entities/courier';

class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = [];

  async create(courier: Courier) {
    this.items.push(courier);
  }

  async findOneById(id: string) {
    const courier = this.items.find((item) => item.id.value === id);

    if (!courier) {
      return null;
    }

    return courier;
  }

  async findOneByDocumentID(documentID: string) {
    const courier = this.items.find(
      (item) => item.documentID.value === documentID,
    );

    if (!courier) {
      return null;
    }

    return courier;
  }

  async deleteOneById(id: string) {
    const index = this.items.findIndex((item) => item.id.value === id);

    this.items.splice(index, 1);
  }
}

export { InMemoryCouriersRepository };
