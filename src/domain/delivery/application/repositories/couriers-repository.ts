import { Courier } from "../../enterprise/entities/courier";
import { DocumentID } from "../../enterprise/entities/value-objects/document-id";

abstract class CouriersRepositiory {
  abstract create(courier: Courier): Promise<void>
  abstract findOneByDocumentID(documentID: DocumentID): Promise<Courier | null>
}

export { CouriersRepositiory };