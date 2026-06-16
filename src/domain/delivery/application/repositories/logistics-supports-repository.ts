import { LogisticsSupport } from '../../enterprise/entities/logistics-support';
import { DocumentID } from '../../enterprise/entities/value-objects/document-id';

abstract class LogisticsSupportsRepositiory {
  abstract create(logisticssupport: LogisticsSupport): Promise<void>;
  abstract findOneById(id: string): Promise<LogisticsSupport | null>;
  abstract findOneByDocumentID(
    documentID: DocumentID,
  ): Promise<LogisticsSupport | null>;
}

export { LogisticsSupportsRepositiory };
