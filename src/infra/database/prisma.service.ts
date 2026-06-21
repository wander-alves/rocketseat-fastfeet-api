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
    const databaseURLSchema = databaseURL.searchParams.get('schema');

    const adapter = new PrismaPg(
      {
        connectionString: databaseURL.toString(),
      },
      {
        schema: databaseURLSchema || 'public',
      },
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
