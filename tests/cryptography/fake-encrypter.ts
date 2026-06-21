import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';

class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>) {
    return JSON.stringify(payload);
  }

  async hash(plainText: string) {
    return plainText.concat('-hashed');
  }

  async compare(plainText: string, hash: string) {
    const hashedPlainText = await this.hash(plainText);
    return hashedPlainText === hash;
  }
}

export { FakeEncrypter };
