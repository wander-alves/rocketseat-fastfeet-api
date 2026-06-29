import { Module } from '@nestjs/common';

import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer';

import { EnvModule } from '@/infra/env/env.module';
import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { BcryptService } from '@/infra/cryptography/bcrypt.service';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncryter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptService,
    },
    {
      provide: HashComparer,
      useClass: BcryptService,
    },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
class CryptographyModule {}

export { CryptographyModule };
