import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { PrismaService } from '@/infra/database/prisma.service';

describe('[E2E] Delete Shipment Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtEncryter;

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtEncryter],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtEncryter);

    await app.init();
  });

  test('[POST] /api/shipments/:id', async () => {
    const recipient = await prisma.user.findUniqueOrThrow({
      where: {
        documentID: '888.888.888-02',
      },
    });

    const admin = await prisma.user.findUniqueOrThrow({
      where: {
        documentID: '999.999.999-01',
      },
    });

    const accessToken = await jwt.encrypt({
      sub: admin.id,
      role: admin.role,
    });

    const shipment = await prisma.shipment.create({
      data: {
        recipientId: recipient?.id,
        name: 'Pacote 01',
        street: 'Rua dos Bobos',
        addressNumber: 0,
        neighborhood: 'Vila Sesamo',
        state: 'GO',
        zipcode: '0000-000',
      },
    });

    const shipmentId = shipment.id;

    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer)
      .delete(`/api/shipments/${shipmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);
  });
});
