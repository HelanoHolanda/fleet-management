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

describe('Vehicles integration - POST /vehicles', () => {
  let context: IntegrationTestContext;

  beforeAll(async () => {
    context = await createIntegrationTestApp();
  });

  afterAll(async () => {
    await deleteIntegrationVehicleByPlate(context.dataSource, 'TST1A23');
    await closeIntegrationTestApp(context);
  });

  it('should create a vehicle when request has a valid bearer token', async () => {
    const user = await createIntegrationUser(context.dataSource, {
      nickname: 'integration_vehicle_create',
      email: 'integration-vehicle-create@aivacol.com',
      password: 'aivacol123',
    });
    const model = await createIntegrationModel(
      context.dataSource,
      'Integration Model Create',
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

    await deleteIntegrationVehicleByPlate(context.dataSource, 'TST1A23');

    const response = await request(context.app.getHttpServer() as App)
      .post('/vehicles')
      .set('Authorization', `Bearer ${loginBody.access_token}`)
      .send({
        licensePlate: 'TST1A23',
        chassis: '9BWZZZ377VT004251',
        renavam: '12345678901',
        year: 2024,
        modelId: model.id,
      })
      .expect(201);

    expect(response.body).toEqual({
      message: 'Veículo criado com sucesso',
      data: {
        licensePlate: 'TST1A23',
        chassis: '9BWZZZ377VT004251',
        renavam: '12345678901',
        year: 2024,
        model: {
          id: model.id,
          name: model.name,
        },
      },
    });
    expect(context.cacheManager.del).toHaveBeenCalledWith('vehicles:all');
    expect(context.vehiclePublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'vehicle.created',
        userId: user.id,
      }),
    );
  });
});
