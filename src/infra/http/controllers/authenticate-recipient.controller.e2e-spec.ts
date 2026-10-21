import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

describe('[E2E] Authenticate Recipient Controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /api/signin', async () => {
    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer).post('/api/signin').send({
      document: '888.888.888-02',
      password: 'recipient01',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      access_token: expect.any(String),
    });
  });
});
