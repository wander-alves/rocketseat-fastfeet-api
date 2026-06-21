import { Courier } from '@/domain/delivery/enterprise/entities/courier';

abstract class CouriersRepositiory {
  abstract create(courier: Courier): Promise<void>;
  abstract findOneById(id: string): Promise<Courier | null>;
  abstract findOneByDocumentID(documentID: string): Promise<Courier | null>;
}

export { CouriersRepositiory };
