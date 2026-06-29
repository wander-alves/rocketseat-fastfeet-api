import { beforeAll, afterAll } from 'vitest';
import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

import { envSchema } from '@/infra/env/env';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/../prisma/generated/client/client';
import { seed } from '@/../tests/setup/seed';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);
const databaseURL = new URL(env.DATABASE_URL);

let adapter: PrismaPg = new PrismaPg({
  connectionString: databaseURL.toString(),
});

let prismaClient: PrismaClient = new PrismaClient({ adapter });

function generateDatabaseURL(schemaID: string) {
  databaseURL.searchParams.set('schema', schemaID);

  return databaseURL.toString();
}

const schemaID = randomUUID();

beforeAll(async () => {
  const randomDatabaseURL = generateDatabaseURL(schemaID);

  adapter = new PrismaPg(
    {
      connectionString: databaseURL.toString(),
    },
    { schema: schemaID },
  );

  prismaClient = new PrismaClient({ adapter });
  process.env.DATABASE_URL = randomDatabaseURL;

  execSync('npx prisma migrate deploy');
  await seed();
});

afterAll(async () => {
  await prismaClient.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`,
  );
  await prismaClient.$disconnect();
});

export { prismaClient };
