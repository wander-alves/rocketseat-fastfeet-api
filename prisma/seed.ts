import { hash } from 'bcryptjs';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client/client';

import { envSchema } from '../src/infra/env/env';

const env = envSchema.parse(process.env);
const databaseURL = new URL(env.DATABASE_URL);

const adapter: PrismaPg = new PrismaPg({
  connectionString: databaseURL.toString(),
});

const prismaClient: PrismaClient = new PrismaClient({ adapter });

async function seed() {
  await prismaClient.user.createMany({
    data: [
      {
        name: 'Admin01',
        documentID: '999.999.999-01',
        password: await hash('admin01', 8),
        role: 'LOGISTICS_SUPPORT',
      },
      {
        name: 'Admin02',
        documentID: '999.999.999-02',
        password: await hash('admin02', 8),
        role: 'LOGISTICS_SUPPORT',
      },
    ],
  });
}

seed()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
