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

  async findAll(): Promise<Vehicle[]> {
    return this.repository.find({
      select: {
        id: true,
        licensePlate: true,
        chassis: true,
        renavam: true,
        year: true,
        model: {
          name: true,
        },
      },
      relations: ['model'],
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['model'],
    });
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { licensePlate } });
  }

  async findByChassis(chassis: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { chassis } });
  }

  async findByRenavam(renavam: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { renavam } });
  }

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    await this.repository.update(id, data);
    return this.findById(id) as Promise<Vehicle>;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
