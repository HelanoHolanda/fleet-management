import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { Vehicle } from '../entities/vehicle.entity';

type FindAllVehiclesResponse = {
  items: Partial<Vehicle>[];
  total: number;
  page: number;
};

@Injectable()
export class FindAllVehiclesUseCase {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(page = 1, limit = 10): Promise<FindAllVehiclesResponse> {
    const cacheKey = `vehicles:all:page:${page}:limit:${limit}`;

    const cached =
      await this.cacheManager.get<FindAllVehiclesResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const vehicles = await this.vehiclesRepository.findAll(page, limit);

    await this.cacheManager.set(cacheKey, vehicles);

    return vehicles;
  }
}
