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

  const brandResponse = {
    message: 'Marca criada com sucesso.',
    data: {
      id: brandId,
      name: 'Toyota',
      createdAt: new Date('2026-06-06T00:00:00.000Z'),
    },
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

  it('should create a brand using current user id', async () => {
    createBrandUseCase.execute.mockResolvedValue(brandResponse);

    const result = await controller.create({ name: 'Toyota' }, {
      id: userId,
    } as any);

    expect(createBrandUseCase.execute).toHaveBeenCalledWith(
      { name: 'Toyota' },
      userId,
    );
    expect(result).toEqual(brandResponse);
  });

  it('should list paginated brands', async () => {
    const response = {
      items: [brandResponse.data],
      total: 1,
      page: 2,
    };
    findBrandsUseCase.execute.mockResolvedValue(response);

    await expect(controller.findAll('2', '5')).resolves.toEqual(response);
    expect(findBrandsUseCase.execute).toHaveBeenCalledWith(2, 5);
  });

  it('should update a brand', async () => {
    const updatedResponse = {
      message: 'Marca atualizada com sucesso.',
      data: {
        ...brandResponse.data,
        name: 'Honda',
      },
    };
    updateBrandUseCase.execute.mockResolvedValue(updatedResponse);

    const result = await controller.update(brandId, { name: 'Honda' });

    expect(updateBrandUseCase.execute).toHaveBeenCalledWith(brandId, {
      name: 'Honda',
    });
    expect(result).toEqual(updatedResponse);
  });

  it('should delete a brand', async () => {
    const response = {
      message: 'Marca removida com sucesso.',
    };
    deleteBrandUseCase.execute.mockResolvedValue(response);

    const result = await controller.delete(brandId);

    expect(deleteBrandUseCase.execute).toHaveBeenCalledWith(brandId);
    expect(result).toEqual(response);
  });

  it('should associate a model to a brand', async () => {
    const response = {
      message: 'Modelo associado a marca com sucesso.',
      data: {
        id: modelId,
        name: 'Corolla',
        brandId,
      },
    };
    associateModelToBrandUseCase.execute.mockResolvedValue(response);

    const result = await controller.associateModel({ brandId, modelId });

    expect(associateModelToBrandUseCase.execute).toHaveBeenCalledWith(
      brandId,
      modelId,
    );
    expect(result).toEqual(response);
  });
});
