import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { VehiclePublisher } from 'src/messaging/publishers/vehicles.publiser';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly vehiclePublisher: VehiclePublisher,
  ) {}

  async execute(id: string): Promise<void> {
    const vehicle = await this.vehiclesRepository.findById(id);
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    await this.vehiclesRepository.delete(id);

    await this.cacheManager.del('vehicles:all');

    await this.vehiclePublisher.publish({
      event: 'vehicle.deleted',
      vehicleId: id,
      userId: vehicle.createdBy || 'system',
      timestamp: new Date(),
    });
  }
}
