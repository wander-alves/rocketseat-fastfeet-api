import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { BcryptService } from '@/infra/cryptography/bcrypt.service';
import { PrismaService } from '@/infra/database/prisma.service';

describe('[E2E] Upload Delivery Proof Controller', () => {
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

  test('[POST] /api/shipments/:shipmentId/delivery-proof', async () => {
    const courier = await prisma.user.findFirstOrThrow({
      where: {
        name: 'Courier01',
      },
    });

    const recipient = await prisma.user.findFirstOrThrow({
      where: {
        name: 'Recipient01',
      },
    });

    const accessToken = await jwt.encrypt({
      sub: courier.id,
      role: 'COURIER',
    });

    const shipment = await prisma.shipment.create({
      data: {
        recipientId: recipient.id,
        name: 'Pacote 02',
        street: 'Rua dos Bobos',
        addressNumber: 0,
        neighborhood: 'Vila Sesamo',
        state: 'GO',
        zipcode: '0000-000',
        status: 'PICKED_UP',
      },
    });

    const httpServer = app.getHttpServer();
    const response = await httpClient(httpServer)
      .post(`/api/shipments/${shipment.id}/delivery-proof`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './tests/mocks/storage/upload-sample.jpg');

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      deliveryProofId: expect.any(String),
    });
  });
});
