import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from '../../models/entities/model.entity';
import { ModelsRepository } from '../../models/repositories/models.repository';
import { BrandsRepository } from '../repositories/brands.repository';

@Injectable()
export class AssociateModelToBrandUseCase {
  constructor(
    private readonly brandsRepository: BrandsRepository,
    private readonly modelsRepository: ModelsRepository,
  ) {}

  async execute(brandId: string, modelId: string): Promise<Model> {
    const brand = await this.brandsRepository.findById(brandId);

    if (!brand) {
      throw new NotFoundException('Marca nao encontrada.');
    }

    const model = await this.modelsRepository.findById(modelId);

    if (!model) {
      throw new NotFoundException('Modelo nao encontrado.');
    }

    return this.modelsRepository.assignBrand(modelId, brandId);
  }
}
