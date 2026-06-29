import { hash } from 'bcryptjs';

import { prismaClient } from '@/../tests/setup/setup-e2e';

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

export { seed };
