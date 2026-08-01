import { ShipmentsRepository } from '@/domain/delivery/application/repositories/shipments-repository';
import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

class InMemoryShipmentsRepository implements ShipmentsRepository {
  public items: Shipment[] = [];

  async create(shipment: Shipment) {
    this.items.push(shipment);
  }

  async findOneById(id: string) {
    const shipment = this.items.find((item) => item.id.value === id);

    if (!shipment) {
      return null;
    }

    return shipment;
  }

  async deleteOneById(id: string) {
    const index = this.items.findIndex((item) => item.id.value === id);

    this.items.splice(index, 1);
  }

  async save(shipment: Shipment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(shipment.id));

    this.items[index] = shipment;
  }
}

export { InMemoryShipmentsRepository };
