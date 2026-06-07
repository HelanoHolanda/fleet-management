import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from '../models/models.module';
import { BrandsController } from './controllers/brands.controller';
import { Brand } from './entities/brand.entity';
import { BrandsRepository } from './repositories/brands.repository';
import { AssociateModelToBrandUseCase } from './use-cases/associate-model-to-brand.use-case';
import { CreateBrandUseCase } from './use-cases/create-brand.use-case';
import { DeleteBrandUseCase } from './use-cases/delete-brand.use-case';
import { FindBrandsUseCase } from './use-cases/find-all-brands.use-case';
import { UpdateBrandUseCase } from './use-cases/update-brand.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), ModelsModule],
  controllers: [BrandsController],
  providers: [
    BrandsRepository,
    CreateBrandUseCase,
    FindBrandsUseCase,
    UpdateBrandUseCase,
    DeleteBrandUseCase,
    AssociateModelToBrandUseCase,
  ],
  exports: [BrandsRepository],
})
export class BrandsModule {}
