import { Courier } from 'src/domain/delivery/enterprise/entities/courier';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

export abstract class CouriersRepository {
  abstract create(courier: Courier): Promise<void>;
  abstract findByGovernmentId(
    id: GovernmentDocumentId,
  ): Promise<Courier | null>;
}
