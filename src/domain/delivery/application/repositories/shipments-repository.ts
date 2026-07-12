import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

abstract class ShipmentsRepository {
  abstract create(shipment: Shipment): Promise<void>;
  abstract findOneById(id: string): Promise<Shipment | null>;
}

export { ShipmentsRepository };
