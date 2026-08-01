import { Shipment } from '@/domain/delivery/enterprise/entities/shipment';

abstract class ShipmentsRepository {
  abstract create(shipment: Shipment): Promise<void>;
  abstract findOneById(id: string): Promise<Shipment | null>;
  abstract deleteOneById(id: string): Promise<void>;
  abstract save(shipment: Shipment): Promise<void>;
}

export { ShipmentsRepository };
