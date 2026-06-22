import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';

@Injectable()
class JwtEncryter implements Encrypter {
  private jwtService: JwtService;
  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  async encrypt(playload: Record<string, unknown>) {
    const encryptedValue = this.jwtService.signAsync(playload);

    return encryptedValue;
  }
}

export { JwtEncryter };
