/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehiclesRepository } from '../repositories/vehicles.repository';
import { Vehicle } from '../entities/vehicle.entity';
import { VehiclePublisher } from '../../messaging/publishers/vehicles.publiser';

type UpdateVehicleResponse = {
  message: string;
  data: Partial<Omit<Vehicle, 'model'>> & {
    model: {
      id: string;
      name: string;
    };
  };
};

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly vehiclePublisher: VehiclePublisher,
  ) {}

  async execute(
    id: string,
    dto: UpdateVehicleDto,
  ): Promise<UpdateVehicleResponse> {
    const vehicle = await this.vehiclesRepository.findById(id);

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    if (dto.licensePlate) {
      const plateExists = await this.vehiclesRepository.findByLicensePlate(
        dto.licensePlate,
      );

      if (plateExists && plateExists.id !== id) {
        throw new ConflictException('Placa já cadastrada');
      }
    }

    if (dto.chassis) {
      const chassisExists = await this.vehiclesRepository.findByChassis(
        dto.chassis,
      );

      if (chassisExists && chassisExists.id !== id) {
        throw new ConflictException('Chassi já cadastrado');
      }
    }

    if (dto.renavam) {
      const renavamExists = await this.vehiclesRepository.findByRenavam(
        dto.renavam,
      );

      if (renavamExists && renavamExists.id !== id) {
        throw new ConflictException('Renavam já cadastrada');
      }
    }

    const updated = await this.vehiclesRepository.update(id, dto);

    await this.cacheManager.del('vehicles:all');

    await this.vehiclePublisher.publish({
      event: 'vehicle.updated',
      vehicleId: updated.id,
      userId: updated.createdBy || 'system',
      timestamp: new Date(),
      data: updated,
    });

    return {
      message: 'Veículo atualizado com sucesso',
      data: {
        id: updated.id,
        licensePlate: updated.licensePlate,
        chassis: updated.chassis,
        renavam: updated.renavam,
        year: updated.year,
        model: {
          id: updated.model.id,
          name: updated.model.name,
        },
      },
    };
  }
}
