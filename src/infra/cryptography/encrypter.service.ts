import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';

class EncrypterService implements Encrypter {
  private jwtService: JwtService;
  private bcryptService: BcryptService;

  constructor(jwtService: JwtService, bcryptService: BcryptService) {
    this.jwtService = jwtService;
    this.bcryptService = bcryptService;
  }

  async encrypt(payload: Record<string, unknown>) {
    const encryptedValue = await this.jwtService.signAsync(payload);

    return encryptedValue;
  }

  async hash(plainText: string) {
    const hashedPlainText = await this.bcryptService.hash(plainText);

    return hashedPlainText;
  }

  async compare(plainText: string, hash: string) {
    const comparisonResult = await this.bcryptService.compare(plainText, hash);

    return comparisonResult;
  }
}

export { EncrypterService };
