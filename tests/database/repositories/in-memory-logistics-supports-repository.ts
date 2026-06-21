import { LogisticsSupportsRepository } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';

class InMemoryLogisticsSupportsRepository implements LogisticsSupportsRepository {
  public items: LogisticsSupport[] = [];

  async create(logisticssupport: LogisticsSupport) {
    this.items.push(logisticssupport);
  }

  async findOneById(id: string) {
    const logisticssupport = this.items.find((item) => item.id.value === id);

    if (!logisticssupport) {
      return null;
    }

    return logisticssupport;
  }

  async findOneByDocumentID(documentID: string) {
    const logisticssupport = this.items.find(
      (item) => item.documentID.value === documentID,
    );

    if (!logisticssupport) {
      return null;
    }

    return logisticssupport;
  }
}

export { InMemoryLogisticsSupportsRepository };
