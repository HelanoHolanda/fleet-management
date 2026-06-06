import { NotFoundException } from '@nestjs/common';
import { Model } from '../../models/entities/model.entity';
import { ModelsRepository } from '../../models/repositories/models.repository';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';
import { AssociateModelToBrandUseCase } from './associate-model-to-brand.use-case';

describe('AssociateModelToBrandUseCase', () => {
  let useCase: AssociateModelToBrandUseCase;
  let brandsRepository: jest.Mocked<Pick<BrandsRepository, 'findById'>>;
  let modelsRepository: jest.Mocked<
    Pick<ModelsRepository, 'findById' | 'assignBrand'>
  >;

  const brandId = '11111111-1111-4111-8111-111111111111';
  const modelId = '22222222-2222-4222-8222-222222222222';
  const userId = '33333333-3333-4333-8333-333333333333';

  const brand: Brand = {
    id: brandId,
    name: 'Toyota',
    createdAt: new Date('2026-06-06T00:00:00.000Z'),
    updatedAt: new Date('2026-06-06T00:00:00.000Z'),
    createdBy: userId,
  };

  const model: Model = {
    id: modelId,
    name: 'Corolla',
    createdAt: new Date('2026-06-06T00:00:00.000Z'),
    updatedAt: new Date('2026-06-06T00:00:00.000Z'),
    createdBy: userId,
  };

  beforeEach(() => {
    brandsRepository = {
      findById: jest.fn(),
    };
    modelsRepository = {
      findById: jest.fn(),
      assignBrand: jest.fn(),
    };

    useCase = new AssociateModelToBrandUseCase(
      brandsRepository as unknown as BrandsRepository,
      modelsRepository as unknown as ModelsRepository,
    );
  });

  it('should associate a model to a brand', async () => {
    const associatedModel = { ...model, brandId };
    brandsRepository.findById.mockResolvedValue(brand);
    modelsRepository.findById.mockResolvedValue(model);
    modelsRepository.assignBrand.mockResolvedValue(associatedModel);

    const result = await useCase.execute(brandId, modelId);

    expect(brandsRepository.findById).toHaveBeenCalledWith(brandId);
    expect(modelsRepository.findById).toHaveBeenCalledWith(modelId);
    expect(modelsRepository.assignBrand).toHaveBeenCalledWith(modelId, brandId);
    expect(result).toEqual(associatedModel);
  });

  it('should throw NotFoundException when brand does not exist', async () => {
    brandsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(brandId, modelId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(modelsRepository.findById).not.toHaveBeenCalled();
    expect(modelsRepository.assignBrand).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when model does not exist', async () => {
    brandsRepository.findById.mockResolvedValue(brand);
    modelsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(brandId, modelId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(modelsRepository.assignBrand).not.toHaveBeenCalled();
  });
});
