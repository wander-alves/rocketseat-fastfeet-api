import { DeliveryProofsRepository } from '@/domain/delivery/application/repositories/delivery-proofs-repository';
import { DeliveryProof } from '@/domain/delivery/enterprise/entities/delivery-proof';

class InMemoryDeliveryProofsRepository implements DeliveryProofsRepository {
  public items: DeliveryProof[] = [];

  async create(deliveryProof: DeliveryProof) {
    this.items.push(deliveryProof);
  }

  async findOneById(id: string) {
    const deliveryProof = this.items.find((item) => item.id.value === id);

    if (!deliveryProof) {
      return null;
    }

    return deliveryProof;
  }

  async deleteOneById(id: string) {
    const index = this.items.findIndex((item) => item.id.value === id);

    this.items.splice(index, 1);
  }
}

export { InMemoryDeliveryProofsRepository };
