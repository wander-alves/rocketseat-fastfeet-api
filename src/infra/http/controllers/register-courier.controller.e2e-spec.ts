import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { PrismaService } from '@/infra/database/prisma.service';
import { BcryptService } from '@/infra/cryptography/bcrypt.service';

describe('[E2E] Register Courier Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let bcrypt: BcryptService;
  let jwt: JwtEncryter;

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtEncryter, BcryptService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    bcrypt = moduleRef.get(BcryptService);
    jwt = moduleRef.get(JwtEncryter);

    await app.init();
  });

  test('[POST] /api/accounts/couriers', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        password: await bcrypt.hash('strong'),
        documentID: '111.222.333-46',
      },
    });

    // const logisticsSupport = await prisma.user.findFirst({
    //   where: {
    //     name: 'Admin01',
    //   },
    // });

    const accessToken = await jwt.encrypt({
      sub: user.id,
      role: 'LOGISTICSSUPPORT',
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
