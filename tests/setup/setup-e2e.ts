import { beforeAll, afterAll } from 'vitest';
import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/../prisma/generated/client/client';
import { envSchema } from '@/infra/env/env';

config({ path: '.env', override: true });
config({ path: '.env.test.local', override: true });

const env = envSchema.parse(process.env);
const databaseURL = new URL(env.DATABASE_URL);
const schemaID = randomUUID();

const adapter = new PrismaPg({
  connectionString: databaseURL.toString(),
});

export const prismaClient = new PrismaClient({ adapter });

function generateDatabaseURL(schemaID: string) {
  databaseURL.searchParams.set('schema', schemaID);

  return databaseURL.toString();
}

beforeAll(async () => {
  const randomDatabaseURL = generateDatabaseURL(schemaID);

  process.env.DATABASE_URL = randomDatabaseURL;

  execSync('npx prisma migrate deploy');
  console.log(process.env.DATABASE_URL);
});

afterAll(async () => {
  await prismaClient.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`,
  );
  await prismaClient.$disconnect();
});
