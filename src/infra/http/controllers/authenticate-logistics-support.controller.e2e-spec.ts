import { describe, beforeAll, test, expect } from 'vitest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import httpClient from 'supertest';

import { DatabaseModule } from '@/infra/database/database.module';

describe('[E2E] Authenticate Logistics Support Controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /api/admin/signin', async () => {
    const httpServer = app.getHttpServer();

    const response = await httpClient(httpServer)
      .post('/api/admin/signin')
      .send({
        document: '999.999.999-01',
        password: 'admin01',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      access_token: expect.any(String),
    });
  });
});
