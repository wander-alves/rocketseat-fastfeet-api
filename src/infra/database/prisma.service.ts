import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/../prisma/generated/client/client';
import { EnvService } from '../env/env.service';

@Injectable()
class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(envService: EnvService) {
    const databaseURLEnv = envService.get('DATABASE_URL');
    const databaseURL = new URL(databaseURLEnv);
    const connectionString = databaseURL.toString();
    const schema = databaseURL.searchParams.get('schema') ?? 'public';

    const adapter = new PrismaPg(
      {
        connectionString,
      },
      { schema },
    );

    super({
      log: ['warn', 'error'],
      adapter,
    });
  }

  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}

export { PrismaService };
