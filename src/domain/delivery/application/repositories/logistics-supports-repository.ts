import { LogisticsSupport } from 'src/domain/delivery/enterprise/entities/logistics-support';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

export abstract class LogisticsSupportsRepository {
  abstract create(logisticssupport: LogisticsSupport): Promise<void>;
  abstract findByGovernmentId(
    id: GovernmentDocumentId,
  ): Promise<LogisticsSupport | null>;
}
