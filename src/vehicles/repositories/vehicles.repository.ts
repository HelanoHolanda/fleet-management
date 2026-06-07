import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehiclesRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
  ) {}

  async create(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const newVehicle = this.repository.create(vehicle);
    const saved = await this.repository.save(newVehicle);
    return this.findById(saved.id) as Promise<Vehicle>;
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    items: Partial<Vehicle>[];
    total: number;
    page: number;
  }> {
    const [items, total] = await this.repository.findAndCount({
      select: {
        id: true,
        licensePlate: true,
        chassis: true,
        renavam: true,
        year: true,
        model: {
          id: true,
          name: true,
        },
      },
      relations: {
        model: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
    };
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.repository.findOne({
      where: { id: id },
      relations: ['model'],
    });
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { licensePlate: licensePlate } });
  }

  async findByChassis(chassis: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { chassis: chassis } });
  }

  async findByRenavam(renavam: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { renavam: renavam } });
  }

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    await this.repository.update(id, data);
    return this.findById(id) as Promise<Vehicle>;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
