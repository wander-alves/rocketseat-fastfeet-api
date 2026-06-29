import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { DatabaseModule } from '@/infra/database/database.module';
import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { PrismaService } from '@/infra/database/prisma.service';

describe('[E2E] Register Courier Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtEncryter;

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [JwtEncryter],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtEncryter);

    await app.init();
  });

  test('[POST] /api/accounts/couriers', async () => {
    const logisticsSupport = await prisma.user.findFirst({
      where: {
        name: 'Admin01',
      },
    });

    const accessToken = await jwt.encrypt({
      sub: logisticsSupport?.id,
    });

    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer)
      .post('/api/accounts/couriers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'master',
        password: 'ofputtets',
        document: '111.222.333-44',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.courier).toEqual({
      id: expect.any(String),
      name: 'master',
      document: '111.222.333-44',
    });
  });
});
