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
import { VehiclePublisher } from '../../messaging/publishers/vehicles.publiser';

type CreateVehicleResponse = {
  message: string;
  data: Partial<Omit<Vehicle, 'model'>> & {
    model: {
      id: string;
      name: string;
    };
  };
};

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    private readonly modelsRepository: ModelsRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly vehiclePublisher: VehiclePublisher,
  ) {}

  async execute(
    dto: CreateVehicleDto,
    createdBy: string,
  ): Promise<CreateVehicleResponse> {
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

    await this.vehiclePublisher.publish({
      event: 'vehicle.created',
      vehicleId: vehicle.id,
      userId: createdBy,
      timestamp: new Date(),
      data: vehicle,
    });

    return {
      message: 'Veículo criado com sucesso',
      data: {
        licensePlate: vehicle.licensePlate,
        chassis: vehicle.chassis,
        renavam: vehicle.renavam,
        year: vehicle.year,
        model: {
          id: model.id,
          name: model.name,
        },
      },
    };
  }
}
