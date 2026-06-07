import request from 'supertest';
import { App } from 'supertest/types';
import {
  closeIntegrationTestApp,
  createIntegrationTestApp,
  createIntegrationUser,
  IntegrationTestContext,
} from './helpers/integration-test-app';

type LoginResponse = {
  access_token: string;
};

describe('Auth integration - POST /auth/login', () => {
  let context: IntegrationTestContext;

  beforeAll(async () => {
    context = await createIntegrationTestApp();
  });

  afterAll(async () => {
    await closeIntegrationTestApp(context);
  });

  it('should authenticate the default seeded user credentials', async () => {
    await createIntegrationUser(context.dataSource, {
      nickname: 'aivacol',
      email: 'integration-aivacol@aivacol.com',
      password: 'aivacol123',
    });

    const response = await request(context.app.getHttpServer() as App)
      .post('/auth/login')
      .send({
        nickname: 'aivacol',
        password: 'aivacol123',
      })
      .expect(201);
    const body = response.body as unknown as LoginResponse;

    expect(typeof body.access_token).toBe('string');
    expect(body.access_token.length).toBeGreaterThan(0);
  });
});
