import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvModule } from '@/infra/env/env.module';
import { EnvService } from '@/infra/env/env.service';
import { JwtStrategy } from '@/infra/authentication/jwt.strategy';
import { JwtAuthGuard } from '@/infra/authentication/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(envService: EnvService) {
        const base64PrivKey = envService.get('JWT_PRIV_KEY');
        const base64PublKey = envService.get('JWT_PUBL_KEY');
        const privateKey = Buffer.from(base64PrivKey, 'base64');
        const publicKey = Buffer.from(base64PublKey, 'base64');

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey,
          publicKey,
        };
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
class AuthenticationModule {}

export { AuthenticationModule };
