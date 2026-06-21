import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';

abstract class LogisticsSupportsRepositiory {
  abstract create(logisticssupport: LogisticsSupport): Promise<void>;
  abstract findOneById(id: string): Promise<LogisticsSupport | null>;
  abstract findOneByDocumentID(
    documentID: string,
  ): Promise<LogisticsSupport | null>;
}

export { LogisticsSupportsRepositiory };
