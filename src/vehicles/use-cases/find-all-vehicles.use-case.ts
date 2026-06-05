import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class FindAllVehiclesUseCase {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(): Promise<Vehicle[]> {
    const cacheKey = 'vehicles:all';

    const cached = await this.cacheManager.get<Vehicle[]>(cacheKey);
    if (cached) return cached;

    const vehicles = await this.vehiclesRepository.findAll();

    await this.cacheManager.set(cacheKey, vehicles);

    return vehicles;
  }
}
