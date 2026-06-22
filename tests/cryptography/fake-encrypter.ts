import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';

class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>) {
    return JSON.stringify(payload);
  }
}

export { FakeEncrypter };
