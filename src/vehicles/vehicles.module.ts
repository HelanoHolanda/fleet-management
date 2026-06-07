import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from '../models/models.module';
import { VehiclesController } from './controllers/vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesRepository } from './repositories/vehicles.repository';
import { CreateVehicleUseCase } from './use-cases/create-vehicles.use-case';
import { DeleteVehicleUseCase } from './use-cases/delete-vehicle.use-case';
import { FindAllVehiclesUseCase } from './use-cases/find-all-vehicles.use-case';
import { UpdateVehicleUseCase } from './use-cases/update-vehicle.use-case';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), ModelsModule, MessagingModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesRepository,
    CreateVehicleUseCase,
    FindAllVehiclesUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
  ],
  exports: [VehiclesRepository],
})
export class VehiclesModule {}
