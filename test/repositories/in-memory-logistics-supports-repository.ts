import { LogisticsSupportsRepository } from 'src/domain/delivery/application/repositories/logistics-supports-repository';
import { LogisticsSupport } from 'src/domain/delivery/enterprise/entities/logistics-support';
import { GovernmentDocumentId } from 'src/domain/delivery/enterprise/entities/value-objects/government-document-id';

export class InMemoryLogisticsSupportsRepository implements LogisticsSupportsRepository {
  public items: LogisticsSupport[] = [];

  async create(logisticssupport: LogisticsSupport): Promise<void> {
    this.items.push(logisticssupport);
  }

  async findByGovernmentId(
    id: GovernmentDocumentId,
  ): Promise<LogisticsSupport | null> {
    const logisticssupport = this.items.find(
      (item) => item.governmentDocumentId === id,
    );

    if (!logisticssupport) {
      return null;
    }

    return logisticssupport;
  }
}
