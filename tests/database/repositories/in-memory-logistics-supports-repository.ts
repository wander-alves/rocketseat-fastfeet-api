import { LogisticsSupportsRepositiory } from '@/domain/delivery/application/repositories/logistics-supports-repository';
import { LogisticsSupport } from '@/domain/delivery/enterprise/entities/logistics-support';
import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

class InMemoryLogisticsSupportsRepositiory implements LogisticsSupportsRepositiory {
  public items: LogisticsSupport[] = [];

  async create(logisticssupport: LogisticsSupport) {
    this.items.push(logisticssupport);
  }

  async findOneByDocumentID(documentID: DocumentID) {
    const logisticssupport = this.items.find((item) =>
      item.documentID.equals(documentID),
    );

    if (!logisticssupport) {
      return null;
    }

    return logisticssupport;
  }
}

export { InMemoryLogisticsSupportsRepositiory };
