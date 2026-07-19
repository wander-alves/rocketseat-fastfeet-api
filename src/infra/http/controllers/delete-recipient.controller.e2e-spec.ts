import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { PrismaService } from '@/infra/database/prisma.service';
import { BcryptService } from '@/infra/cryptography/bcrypt.service';

describe('[E2E] Delete Recipient Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtEncryter;

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtEncryter, BcryptService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtEncryter);

    await app.init();
  });

  test('[DELETE] /api/accounts/recipients/:recipientId', async () => {
    const adminUser = await prisma.user.findFirst({
      where: {
        name: 'Admin01',
      },
    });

    const recipient = await prisma.user.findFirst({
      where: {
        name: 'Recipient01',
      },
    });

    const accessToken = await jwt.encrypt({
      sub: adminUser?.id,
      role: 'LOGISTICSSUPPORT',
    });

    const recipientId = recipient?.id;

    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer)
      .delete(`/api/accounts/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);
  });
});
