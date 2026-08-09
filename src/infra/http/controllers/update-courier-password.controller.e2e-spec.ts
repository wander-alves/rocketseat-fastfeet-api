import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { JwtEncryter } from '@/infra/cryptography/jwt-encrypter';
import { PrismaService } from '@/infra/database/prisma.service';
import { BcryptService } from '@/infra/cryptography/bcrypt.service';

describe('[E2E] Update Courier Password Controller', () => {
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

  test('[PUT] /api/accounts/couriers/:id/update-password', async () => {
    const adminUser = await prisma.user.findFirstOrThrow({
      where: {
        name: 'Admin01',
      },
    });

    const courier = await prisma.user.findFirstOrThrow({
      where: {
        name: 'Courier01',
      },
    });

    const accessToken = await jwt.encrypt({
      sub: adminUser?.id,
      role: 'LOGISTICSSUPPORT',
    });

    const courierId = courier.id;

    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer)
      .put(`/api/accounts/couriers/${courierId}/update-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: 'newpassword',
        confirmPassword: 'newpassword',
      });

    expect(response.statusCode).toBe(204);

    const updatedCourier = await prisma.user.findUniqueOrThrow({
      where: {
        id: courierId,
      },
    });

    expect(updatedCourier.updatedAt).greaterThan(courier.createdAt);
  });
});
