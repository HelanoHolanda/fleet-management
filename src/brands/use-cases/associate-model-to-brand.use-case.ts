import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from '../../models/entities/model.entity';
import { ModelsRepository } from '../../models/repositories/models.repository';
import { BrandsRepository } from '../repositories/brands.repository';

type AssociateModelToBrandResponse = {
  message: string;
  data: Partial<Omit<Model, 'brand'>> & {
    brand?: {
      id: string;
      name: string;
    };
  };
};

@Injectable()
export class AssociateModelToBrandUseCase {
  constructor(
    private readonly brandsRepository: BrandsRepository,
    private readonly modelsRepository: ModelsRepository,
  ) {}

  async execute(
    brandId: string,
    modelId: string,
  ): Promise<AssociateModelToBrandResponse> {
    const brand = await this.brandsRepository.findById(brandId);

    if (!brand) {
      throw new NotFoundException('Marca nao encontrada.');
    }

    const model = await this.modelsRepository.findById(modelId);

    if (!model) {
      throw new NotFoundException('Modelo nao encontrado.');
    }

    const associatedModel = await this.modelsRepository.assignBrand(
      modelId,
      brandId,
    );

    return {
      message: 'Modelo associado a marca com sucesso.',
      data: {
        id: associatedModel.id,
        name: associatedModel.name,
        brandId: associatedModel.brandId,
        brand: associatedModel.brand
          ? {
              id: associatedModel.brand.id,
              name: associatedModel.brand.name,
            }
          : undefined,
      },
    };
  }
}
