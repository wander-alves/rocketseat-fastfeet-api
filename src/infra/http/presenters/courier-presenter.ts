import { Courier } from '@/domain/delivery/enterprise/entities/courier';

class CourierPresenter {
  static toHTTP(courier: Courier) {
    const httpCourier = {
      id: courier.id.value,
      name: courier.name,
      document: courier.documentID.value,
    };

    return httpCourier;
  }
}

export { CourierPresenter };
