import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

class FakeHasher implements HashComparer, HashGenerator {
  async hash(plainText: string) {
    return plainText.concat('-hashed');
  }

  async compare(plainText: string, hash: string) {
    const hashedPlainText = await this.hash(plainText);
    return hashedPlainText === hash;
  }
}

export { FakeHasher };
