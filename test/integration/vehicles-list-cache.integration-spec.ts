import request from 'supertest';
import { App } from 'supertest/types';
import {
  closeIntegrationTestApp,
  createIntegrationModel,
  createIntegrationTestApp,
  createIntegrationUser,
  deleteIntegrationVehicleByPlate,
  IntegrationTestContext,
} from './helpers/integration-test-app';

type LoginResponse = {
  access_token: string;
};

type VehicleListResponse = {
  items: Array<{
    licensePlate: string;
  }>;
  total: number;
  page: number;
};

describe('Vehicles integration - GET /vehicles cache', () => {
  let context: IntegrationTestContext;

  beforeAll(async () => {
    context = await createIntegrationTestApp();
  });

  afterAll(async () => {
    await deleteIntegrationVehicleByPlate(context.dataSource, 'TST1B23');
    await closeIntegrationTestApp(context);
  });

  it('should cache paginated vehicle list responses', async () => {
    const user = await createIntegrationUser(context.dataSource, {
      nickname: 'integration_vehicle_cache',
      email: 'integration-vehicle-cache@aivacol.com',
      password: 'aivacol123',
    });
    const model = await createIntegrationModel(
      context.dataSource,
      'Integration Model Cache',
      user.id,
    );

    const loginResponse = await request(context.app.getHttpServer() as App)
      .post('/auth/login')
      .send({
        nickname: user.nickname,
        password: 'aivacol123',
      })
      .expect(201);
    const loginBody = loginResponse.body as unknown as LoginResponse;
    const token = loginBody.access_token;

    await deleteIntegrationVehicleByPlate(context.dataSource, 'TST1B23');
    await request(context.app.getHttpServer() as App)
      .post('/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        licensePlate: 'TST1B23',
        chassis: '9BWZZZ377VT004252',
        renavam: '12345678902',
        year: 2024,
        modelId: model.id,
      })
      .expect(201);

    context.cacheStore.clear();
    context.cacheManager.get.mockClear();
    context.cacheManager.set.mockClear();

    const firstResponse = await request(context.app.getHttpServer() as App)
      .get('/vehicles?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const firstBody = firstResponse.body as unknown as VehicleListResponse;

    const secondResponse = await request(context.app.getHttpServer() as App)
      .get('/vehicles?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const secondBody = secondResponse.body as unknown as VehicleListResponse;

    expect(
      firstBody.items.some((vehicle) => vehicle.licensePlate === 'TST1B23'),
    ).toBe(true);
    expect(secondBody).toEqual(firstBody);
    expect(context.cacheManager.get).toHaveBeenCalledTimes(2);
    expect(context.cacheManager.get).toHaveBeenCalledWith(
      'vehicles:all:page:1:limit:10',
    );
    expect(context.cacheManager.set).toHaveBeenCalledTimes(1);
    const setCalls = context.cacheManager.set.mock.calls as Array<
      [string, VehicleListResponse]
    >;
    expect(setCalls[0][0]).toBe('vehicles:all:page:1:limit:10');
    expect(Array.isArray(setCalls[0][1].items)).toBe(true);
    expect(typeof setCalls[0][1].total).toBe('number');
    expect(setCalls[0][1].page).toBe(1);
  });
});
