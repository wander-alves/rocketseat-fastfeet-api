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
}

export { InMemoryShipmentsRepository };
