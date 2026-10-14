import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { PrismaService } from '@/infra/database/prisma.service';

describe('[E2E] Deliver Shipment Controller', () => {
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

  test('[PATCH] /api/shipments/:shipmentId/deliver', async () => {
    const recipient = await prisma.user.findFirst({
      where: {
        name: 'Recipient01',
      },
    });

    const courier = await prisma.user.findFirst({
      where: {
        name: 'Courier01',
      },
    });

    const accessToken = await jwt.encrypt({
      sub: courier?.id,
      role: 'COURIER',
    });

    const deliveryProof = await prisma.deliveryProof.create({
      data: {
        title: 'Delivery Proof 01',
        url: 'http://someurl.domain.com',
      },
    });

    const shipment = await prisma.shipment.create({
      data: {
        recipientId: recipient!.id,
        name: 'Pacote 02',
        street: 'Rua dos Bobos',
        addressNumber: 0,
        neighborhood: 'Vila Sesamo',
        state: 'GO',
        zipcode: '0000-000',
      },
    });

    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer)
      .patch(`/api/shipments/${shipment.id}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliveryProofId: deliveryProof.id,
      });

    expect(response.statusCode).toBe(204);
  });
});
