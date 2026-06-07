import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsController } from './controllers/models.controller';
import { Model } from './entities/model.entity';
import { ModelsRepository } from './repositories/models.repository';
import { CreateModelUseCase } from './use-cases/create-model.use-case';
import { DeleteModelUseCase } from './use-cases/delete-model.use-case';
import { FindModelsUseCase } from './use-cases/find-models.use-case';
import { UpdateModelUseCase } from './use-cases/update-model.use-case';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Model, Vehicle])],
  controllers: [ModelsController],
  providers: [
    ModelsRepository,
    CreateModelUseCase,
    FindModelsUseCase,
    UpdateModelUseCase,
    DeleteModelUseCase,
  ],
  exports: [ModelsRepository],
})
export class ModelsModule {}
