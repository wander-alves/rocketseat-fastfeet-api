import { CouriersRepositiory } from "@/domain/delivery/application/repositories/couriers-repository";
import { Courier } from "@/domain/delivery/enterprise/entities/courier";
import { DocumentID } from "@/domain/delivery/enterprise/entities/value-objects/document-id";

class InMemoryCouriersRepositiory implements CouriersRepositiory {
  public items: Courier[] = [];

  async create(courier: Courier) {
    this.items.push(courier);
  }

  async findOneByDocumentID(documentID: DocumentID) {
    const courier = this.items.find((item)=> item.documentID.equals(documentID));

    if(!courier){ 
      return null;
    }

    return courier;
  }
}

export { InMemoryCouriersRepositiory };