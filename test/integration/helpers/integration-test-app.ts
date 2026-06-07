import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { AuthModule } from '../../../src/auth/auth.module';
import { VehiclePublisher } from '../../../src/messaging/publishers/vehicles.publiser';
import { Model } from '../../../src/models/entities/model.entity';
import { ModelsModule } from '../../../src/models/models.module';
import { User } from '../../../src/users/entities/user.entity';
import { Vehicle } from '../../../src/vehicles/entities/vehicle.entity';
import { VehiclesModule } from '../../../src/vehicles/vehicles.module';

type CacheStore = Map<string, unknown>;

export type IntegrationTestContext = {
  app: INestApplication;
  dataSource: DataSource;
  cacheStore: CacheStore;
  cacheManager: {
    get: jest.Mock;
    set: jest.Mock;
    del: jest.Mock;
  };
  vehiclePublisher: {
    publish: jest.Mock;
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') ?? '1433'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/../../../src/**/*.entity{.ts,.js}'],
        synchronize: false,
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    ModelsModule,
    VehiclesModule,
  ],
})
class IntegrationTestModule {}

export async function createIntegrationTestApp(): Promise<IntegrationTestContext> {
  const cacheStore: CacheStore = new Map();
  const cacheManager = {
    get: jest.fn((key: string) => Promise.resolve(cacheStore.get(key))),
    set: jest.fn((key: string, value: unknown) => {
      cacheStore.set(key, value);
      return Promise.resolve();
    }),
    del: jest.fn((key: string) => {
      cacheStore.delete(key);
      return Promise.resolve();
    }),
  };
  const vehiclePublisher = {
    publish: jest.fn().mockResolvedValue(undefined),
  };

  const moduleRef = await Test.createTestingModule({
    imports: [IntegrationTestModule],
  })
    .overrideProvider(CACHE_MANAGER)
    .useValue(cacheManager)
    .overrideProvider(VehiclePublisher)
    .useValue(vehiclePublisher)
    .compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.init();

  return {
    app,
    dataSource: app.get(DataSource),
    cacheStore,
    cacheManager,
    vehiclePublisher,
  };
}

export async function closeIntegrationTestApp(
  context: IntegrationTestContext,
): Promise<void> {
  await context.app.close();
}

export async function createIntegrationUser(
  dataSource: DataSource,
  overrides: Partial<User> = {},
): Promise<User> {
  const usersRepository = dataSource.getRepository(User);
  const nickname = overrides.nickname ?? 'integration_aivacol';

  await usersRepository.delete({ nickname });

  const user = usersRepository.create({
    nickname,
    name: overrides.name ?? 'Integration User',
    email: overrides.email ?? `${nickname}@aivacol.com`,
    password: await hash(overrides.password ?? 'aivacol123', 10),
    createdBy: null,
  });

  return usersRepository.save(user);
}

export async function createIntegrationModel(
  dataSource: DataSource,
  name: string,
  createdBy: string,
): Promise<Model> {
  const modelsRepository = dataSource.getRepository(Model);
  await modelsRepository.delete({ name });

  const model = modelsRepository.create({
    name,
    createdBy,
  });

  return modelsRepository.save(model);
}

export async function deleteIntegrationVehicleByPlate(
  dataSource: DataSource,
  licensePlate: string,
): Promise<void> {
  await dataSource.getRepository(Vehicle).delete({ licensePlate });
}

export function repositories(dataSource: DataSource): {
  users: Repository<User>;
  models: Repository<Model>;
  vehicles: Repository<Vehicle>;
} {
  return {
    users: dataSource.getRepository(User),
    models: dataSource.getRepository(Model),
    vehicles: dataSource.getRepository(Vehicle),
  };
}
