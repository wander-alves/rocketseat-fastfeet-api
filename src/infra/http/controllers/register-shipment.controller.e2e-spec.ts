import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { BcryptService } from '@/infra/cryptography/bcrypt.service';
import { PrismaService } from '@/infra/database/prisma.service';

describe('[E2E] Register Shipment Controller', () => {
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

  test('[POST] /api/shipments', async () => {
    const recipient = await prisma.user.create({
      data: {
        name: 'John Doe',
        password: await bcrypt.hash('strong'),
        documentID: '111.222.333-44',
      },
    });

    const admin = await prisma.user.findFirst({
      where: {
        name: 'Admin01',
      },
    });

    const accessToken = await jwt.encrypt({
      sub: admin?.id,
      role: 'LOGISTICSSUPPORT',
    });

    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id,
        name: 'Pacote 01',
        street: 'Rua dos Bobos',
        addressNumber: 0,
        neighborhood: 'Vila Sesamo',
        state: 'GO',
        zipcode: '0000-000',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.shipment).toMatchObject({
      id: expect.any(String),
      name: 'Pacote 01',
      status: 'WAITING',
    });
  });
});
