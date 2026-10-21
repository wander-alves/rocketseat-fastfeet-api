import { DeliveryProof } from '@/domain/delivery/enterprise/entities/delivery-proof';

abstract class DeliveryProofsRepository {
  abstract create(deliveryProof: DeliveryProof): Promise<void>;
  abstract findOneById(id: string): Promise<DeliveryProof | null>;
  abstract findOneByURL(url: string): Promise<DeliveryProof | null>;
  abstract deleteOneById(id: string): Promise<void>;
}

export { DeliveryProofsRepository };
