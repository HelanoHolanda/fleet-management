import { NotFoundException } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Model } from '../../models/entities/model.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { DeleteVehicleUseCase } from './delete-vehicle.use-case';

describe('DeleteVehicleUseCase', () => {
  let useCase: DeleteVehicleUseCase;
  let vehiclesRepository: jest.Mocked<
    Pick<VehiclesRepository, 'findById' | 'delete'>
  >;
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
      findById: jest.fn(),
      delete: jest.fn(),
    };
    cacheManager = {
      del: jest.fn(),
    };

    useCase = new DeleteVehicleUseCase(
      vehiclesRepository as unknown as VehiclesRepository,
      cacheManager as unknown as Cache,
    );
  });

  it('should delete a vehicle and invalidate cache', async () => {
    vehiclesRepository.findById.mockResolvedValue(vehicle);
    vehiclesRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute('vehicle-id')).resolves.toBeUndefined();
    expect(vehiclesRepository.delete).toHaveBeenCalledWith('vehicle-id');
    expect(cacheManager.del).toHaveBeenCalledWith('vehicles:all');
  });

  it('should throw NotFoundException when vehicle does not exist', async () => {
    vehiclesRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('vehicle-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
