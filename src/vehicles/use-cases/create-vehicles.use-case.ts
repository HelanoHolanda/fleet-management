import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { ModelsRepository } from '../../models/repositories/models.repository';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    private readonly modelsRepository: ModelsRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(dto: CreateVehicleDto, createdBy: string): Promise<Vehicle> {
    const model = await this.modelsRepository.findById(dto.modelId);
    if (!model) throw new NotFoundException('Modelo não encontrado');

    const plateExists = await this.vehiclesRepository.findByLicensePlate(
      dto.licensePlate,
    );
    if (plateExists) throw new ConflictException('Placa já cadastrada');

    const chassisExists = await this.vehiclesRepository.findByChassis(
      dto.chassis,
    );
    if (chassisExists) throw new ConflictException('Chassi já cadastrado');

    const renavamExists = await this.vehiclesRepository.findByRenavam(
      dto.renavam,
    );
    if (renavamExists) throw new ConflictException('Renavam já cadastrado');

    const vehicle = await this.vehiclesRepository.create({
      ...dto,
      createdBy,
    });

    await this.cacheManager.del('vehicles:all');

    return vehicle;
  }
}
