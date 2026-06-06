import type { Cache } from 'cache-manager';
import { Model } from '../../models/entities/model.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { FindAllVehiclesUseCase } from './find-all-vehicles.use-case';

describe('FindAllVehiclesUseCase', () => {
  let useCase: FindAllVehiclesUseCase;
  let vehiclesRepository: jest.Mocked<Pick<VehiclesRepository, 'findAll'>>;
  let cacheManager: jest.Mocked<Pick<Cache, 'get' | 'set'>>;

  const model: Model = {
    id: 'model-id',
    name: 'Corolla',
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: 'user-id',
  };

  const vehicles: Vehicle[] = [
    {
      id: 'vehicle-id',
      licensePlate: 'ABC1D23',
      chassis: '9BWZZZ377VT004251',
      renavam: '12345678901',
      year: 2024,
      modelId: 'model-id',
      model,
      createdAt: new Date('2026-06-05T00:00:00.000Z'),
      updatedAt: new Date('2026-06-05T00:00:00.000Z'),
      createdBy: 'user-id',
    },
  ];

  beforeEach(() => {
    vehiclesRepository = {
      findAll: jest.fn(),
    };
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    useCase = new FindAllVehiclesUseCase(
      vehiclesRepository as unknown as VehiclesRepository,
      cacheManager as unknown as Cache,
    );
  });

  it('should return vehicles from cache when available', async () => {
    cacheManager.get.mockResolvedValue(vehicles);

    await expect(useCase.execute()).resolves.toEqual(vehicles);
    expect(vehiclesRepository.findAll).not.toHaveBeenCalled();
  });

  it('should fetch vehicles and save them in cache when cache is empty', async () => {
    cacheManager.get.mockResolvedValue(undefined);
    vehiclesRepository.findAll.mockResolvedValue(vehicles);

    await expect(useCase.execute()).resolves.toEqual(vehicles);
    expect(vehiclesRepository.findAll).toHaveBeenCalledTimes(1);
    expect(cacheManager.set).toHaveBeenCalledWith('vehicles:all', vehicles);
  });
});
