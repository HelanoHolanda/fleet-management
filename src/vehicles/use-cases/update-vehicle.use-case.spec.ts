import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Model } from '../../models/entities/model.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { UpdateVehicleUseCase } from './update-vehicle.use-case';
import { VehiclePublisher } from '../../messaging/publishers/vehicles.publiser';

describe('UpdateVehicleUseCase', () => {
  let useCase: UpdateVehicleUseCase;
  let vehiclesRepository: jest.Mocked<
    Pick<
      VehiclesRepository,
      | 'findById'
      | 'findByLicensePlate'
      | 'findByChassis'
      | 'findByRenavam'
      | 'update'
    >
  >;
  let cacheManager: jest.Mocked<Pick<Cache, 'del'>>;
  let vehiclePublisher: jest.Mocked<Pick<VehiclePublisher, 'publish'>>;

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
      findByLicensePlate: jest.fn(),
      findByChassis: jest.fn(),
      findByRenavam: jest.fn(),
      update: jest.fn(),
    };
    cacheManager = {
      del: jest.fn(),
    };
    vehiclePublisher = {
      publish: jest.fn(),
    };

    useCase = new UpdateVehicleUseCase(
      vehiclesRepository as unknown as VehiclesRepository,
      cacheManager as unknown as Cache,
      vehiclePublisher as unknown as VehiclePublisher,
    );
  });

  it('should update a vehicle and invalidate cache', async () => {
    vehiclesRepository.findById.mockResolvedValue(vehicle);
    vehiclesRepository.findByLicensePlate.mockResolvedValue(null);
    vehiclesRepository.update.mockResolvedValue({
      ...vehicle,
      licensePlate: 'XYZ9A88',
    });

    const result = await useCase.execute('vehicle-id', {
      licensePlate: 'XYZ9A88',
    });

    expect(vehiclesRepository.update).toHaveBeenCalledWith('vehicle-id', {
      licensePlate: 'XYZ9A88',
    });
    expect(cacheManager.del).toHaveBeenCalledWith('vehicles:all');
    expect(vehiclePublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'vehicle.updated',
        vehicleId: 'vehicle-id',
        userId: 'user-id',
      }),
    );
    expect(result.data.licensePlate).toBe('XYZ9A88');
  });

  it('should throw NotFoundException when vehicle does not exist', async () => {
    vehiclesRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('vehicle-id', { licensePlate: 'XYZ9A88' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw ConflictException when license plate belongs to another vehicle', async () => {
    vehiclesRepository.findById.mockResolvedValue(vehicle);
    vehiclesRepository.findByLicensePlate.mockResolvedValue({
      ...vehicle,
      id: 'another-vehicle-id',
    });

    await expect(
      useCase.execute('vehicle-id', { licensePlate: 'XYZ9A88' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
