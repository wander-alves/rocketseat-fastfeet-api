import { hash, compare } from 'bcryptjs';

import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

class BcryptService implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plainText: string) {
    const passwordHash = await hash(plainText, this.HASH_SALT_LENGTH);

    return passwordHash;
  }

  async compare(plainText: string, hash: string) {
    const comparisonResult = await compare(plainText, hash);

    return comparisonResult;
  }
}

export { BcryptService };
