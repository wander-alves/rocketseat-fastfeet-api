import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EncrypterService } from './encrypter.service';
import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';

@Module({
  imports: [EnvModule],
  providers: [{ provide: Encrypter, useClass: EncrypterService }],
  exports: [Encrypter],
})
class CryptographyModule {}

export { CryptographyModule };
