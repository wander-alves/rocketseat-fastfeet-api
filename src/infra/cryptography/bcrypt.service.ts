import { hash, compare } from 'bcryptjs';

class BcryptService {
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
