import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { PrismaService } from '@/infra/database/prisma.service';
import { BcryptService } from '@/infra/cryptography/bcrypt.service';

describe('[E2E] Authenticate Recipient Controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let bcrypt: BcryptService;

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [BcryptService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    bcrypt = moduleRef.get(BcryptService);

    await app.init();
  });

  test('[POST] /api/signin', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        password: await bcrypt.hash('strong'),
        documentID: '111.222.333-44',
      },
    });

    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer).post('/api/signin').send({
      document: '111.222.333-44',
      password: 'strong',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      access_token: expect.any(String),
    });
  });
});
