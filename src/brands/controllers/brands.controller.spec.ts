import { Model } from '../../models/entities/model.entity';
import { Brand } from '../entities/brand.entity';
import { AssociateModelToBrandUseCase } from '../use-cases/associate-model-to-brand.use-case';
import { CreateBrandUseCase } from '../use-cases/create-brand.use-case';
import { DeleteBrandUseCase } from '../use-cases/delete-brand.use-case';
import { FindBrandsUseCase } from '../use-cases/find-all-brands.use-case';
import { UpdateBrandUseCase } from '../use-cases/update-brand.use-case';
import { BrandsController } from './brands.controller';

describe('BrandsController', () => {
  let controller: BrandsController;
  let createBrandUseCase: jest.Mocked<Pick<CreateBrandUseCase, 'execute'>>;
  let findBrandsUseCase: jest.Mocked<Pick<FindBrandsUseCase, 'execute'>>;
  let updateBrandUseCase: jest.Mocked<Pick<UpdateBrandUseCase, 'execute'>>;
  let deleteBrandUseCase: jest.Mocked<Pick<DeleteBrandUseCase, 'execute'>>;
  let associateModelToBrandUseCase: jest.Mocked<
    Pick<AssociateModelToBrandUseCase, 'execute'>
  >;

  const userId = '33333333-3333-4333-8333-333333333333';
  const brandId = '11111111-1111-4111-8111-111111111111';
  const modelId = '22222222-2222-4222-8222-222222222222';

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
    brandId,
    createdAt: new Date('2026-06-06T00:00:00.000Z'),
    updatedAt: new Date('2026-06-06T00:00:00.000Z'),
    createdBy: userId,
  };

  beforeEach(() => {
    createBrandUseCase = { execute: jest.fn() };
    findBrandsUseCase = { execute: jest.fn() };
    updateBrandUseCase = { execute: jest.fn() };
    deleteBrandUseCase = { execute: jest.fn() };
    associateModelToBrandUseCase = { execute: jest.fn() };

    controller = new BrandsController(
      createBrandUseCase as unknown as CreateBrandUseCase,
      findBrandsUseCase as unknown as FindBrandsUseCase,
      updateBrandUseCase as unknown as UpdateBrandUseCase,
      deleteBrandUseCase as unknown as DeleteBrandUseCase,
      associateModelToBrandUseCase as unknown as AssociateModelToBrandUseCase,
    );
  });

  it('should create a brand using current user id and response pattern', async () => {
    createBrandUseCase.execute.mockResolvedValue(brand);

    const result = await controller.create({ name: 'Toyota' }, {
      id: userId,
    } as any);

    expect(createBrandUseCase.execute).toHaveBeenCalledWith(
      { name: 'Toyota' },
      userId,
    );
    expect(result).toEqual({
      success: true,
      message: 'Marca criada com sucesso.',
      data: brand,
    });
  });

  it('should list brands using response pattern', async () => {
    findBrandsUseCase.execute.mockResolvedValue([brand]);

    await expect(controller.findAll()).resolves.toEqual({
      success: true,
      message: 'Marcas consultadas com sucesso.',
      data: [brand],
    });
  });

  it('should update a brand using response pattern', async () => {
    const updatedBrand = { ...brand, name: 'Honda' };
    updateBrandUseCase.execute.mockResolvedValue(updatedBrand);

    const result = await controller.update(brandId, { name: 'Honda' });

    expect(updateBrandUseCase.execute).toHaveBeenCalledWith(brandId, {
      name: 'Honda',
    });
    expect(result).toEqual({
      success: true,
      message: 'Marca atualizada com sucesso.',
      data: updatedBrand,
    });
  });

  it('should delete a brand using response pattern', async () => {
    deleteBrandUseCase.execute.mockResolvedValue(undefined);

    const result = await controller.delete(brandId);

    expect(deleteBrandUseCase.execute).toHaveBeenCalledWith(brandId);
    expect(result).toEqual({
      success: true,
      message: 'Marca removida com sucesso.',
      data: null,
    });
  });

  it('should associate a model to a brand using response pattern', async () => {
    associateModelToBrandUseCase.execute.mockResolvedValue(model);

    const result = await controller.associateModel(brandId, modelId);

    expect(associateModelToBrandUseCase.execute).toHaveBeenCalledWith(
      brandId,
      modelId,
    );
    expect(result).toEqual({
      success: true,
      message: 'Modelo associado a marca com sucesso.',
      data: model,
    });
  });
});
