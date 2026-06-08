import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HttpModule } from '@/infra/http/http.module';

import { envSchema } from '@/infra/env/env';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
