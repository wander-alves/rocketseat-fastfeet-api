import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envSchema } from '@/infra/env/env';
import { AuthenticationModule } from '@/infra/authentication/authentication.module';
import { HttpModule } from '@/infra/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthenticationModule,
    HttpModule,
  ],
})
export class AppModule {}
