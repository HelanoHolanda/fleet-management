import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Model } from '../../models/entities/model.entity';
import { ModelsRepository } from '../../models/repositories/models.repository';
import { Vehicle } from '../entities/vehicle.entity';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { CreateVehicleUseCase } from './create-vehicles.use-case';

describe('CreateVehicleUseCase', () => {
  let useCase: CreateVehicleUseCase;
  let vehiclesRepository: jest.Mocked<
    Pick<
      VehiclesRepository,
      'create' | 'findByLicensePlate' | 'findByChassis' | 'findByRenavam'
    >
  >;
  let modelsRepository: jest.Mocked<Pick<ModelsRepository, 'findById'>>;
  let cacheManager: jest.Mocked<Pick<Cache, 'del'>>;

  const model: Model = {
    id: 'model-id',
    name: 'Corolla',
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: 'user-id',
  };

  const vehicle: Vehicle = {
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
  };

  beforeEach(() => {
    vehiclesRepository = {
      create: jest.fn(),
      findByLicensePlate: jest.fn(),
      findByChassis: jest.fn(),
      findByRenavam: jest.fn(),
    };
    modelsRepository = {
      findById: jest.fn(),
    };
    cacheManager = {
      del: jest.fn(),
    };

    useCase = new CreateVehicleUseCase(
      vehiclesRepository as unknown as VehiclesRepository,
      modelsRepository as unknown as ModelsRepository,
      cacheManager as unknown as Cache,
    );
  });

  it('should create a vehicle and invalidate cache', async () => {
    modelsRepository.findById.mockResolvedValue(model);
    vehiclesRepository.findByLicensePlate.mockResolvedValue(null);
    vehiclesRepository.findByChassis.mockResolvedValue(null);
    vehiclesRepository.findByRenavam.mockResolvedValue(null);
    vehiclesRepository.create.mockResolvedValue(vehicle);

    const result = await useCase.execute(
      {
        licensePlate: 'ABC1D23',
        chassis: '9BWZZZ377VT004251',
        renavam: '12345678901',
        year: 2024,
        modelId: 'model-id',
      },
      'user-id',
    );

    expect(modelsRepository.findById).toHaveBeenCalledWith('model-id');
    expect(vehiclesRepository.create).toHaveBeenCalledWith({
      licensePlate: 'ABC1D23',
      chassis: '9BWZZZ377VT004251',
      renavam: '12345678901',
      year: 2024,
      modelId: 'model-id',
      createdBy: 'user-id',
    });
    expect(cacheManager.del).toHaveBeenCalledWith('vehicles:all');
    expect(result).toEqual(vehicle);
  });

  it('should throw NotFoundException when model does not exist', async () => {
    modelsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(
        {
          licensePlate: 'ABC1D23',
          chassis: '9BWZZZ377VT004251',
          renavam: '12345678901',
          year: 2024,
          modelId: 'model-id',
        },
        'user-id',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw ConflictException when license plate already exists', async () => {
    modelsRepository.findById.mockResolvedValue(model);
    vehiclesRepository.findByLicensePlate.mockResolvedValue(vehicle);

    await expect(
      useCase.execute(
        {
          licensePlate: 'ABC1D23',
          chassis: '9BWZZZ377VT004251',
          renavam: '12345678901',
          year: 2024,
          modelId: 'model-id',
        },
        'user-id',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
