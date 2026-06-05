import { Model } from '../entities/model.entity';
import { CreateModelUseCase } from '../use-cases/create-model.use-case';
import { DeleteModelUseCase } from '../use-cases/delete-model.use-case';
import { FindModelsUseCase } from '../use-cases/find-models.use-case';
import { UpdateModelUseCase } from '../use-cases/update-model.use-case';
import { ModelsController } from './models.controller';

describe('ModelsController', () => {
  let controller: ModelsController;
  let createModelUseCase: jest.Mocked<Pick<CreateModelUseCase, 'execute'>>;
  let findModelsUseCase: jest.Mocked<Pick<FindModelsUseCase, 'execute'>>;
  let updateModelUseCase: jest.Mocked<Pick<UpdateModelUseCase, 'execute'>>;
  let deleteModelUseCase: jest.Mocked<Pick<DeleteModelUseCase, 'execute'>>;

  const model: Model = {
    id: 'model-id',
    name: 'Corolla',
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: 'user-id',
  };

  beforeEach(() => {
    createModelUseCase = { execute: jest.fn() };
    findModelsUseCase = { execute: jest.fn() };
    updateModelUseCase = { execute: jest.fn() };
    deleteModelUseCase = { execute: jest.fn() };

    controller = new ModelsController(
      createModelUseCase as unknown as CreateModelUseCase,
      findModelsUseCase as unknown as FindModelsUseCase,
      updateModelUseCase as unknown as UpdateModelUseCase,
      deleteModelUseCase as unknown as DeleteModelUseCase,
    );
  });

  it('should create a model using current user id', async () => {
    createModelUseCase.execute.mockResolvedValue(model);

    const result = await controller.create({ name: 'Corolla' }, {
      id: 'user-id',
    } as any);

    expect(createModelUseCase.execute).toHaveBeenCalledWith(
      { name: 'Corolla' },
      'user-id',
    );
    expect(result).toEqual(model);
  });

  it('should list models', async () => {
    findModelsUseCase.execute.mockResolvedValue([model]);

    await expect(controller.findAll()).resolves.toEqual([model]);
  });

  it('should update a model', async () => {
    updateModelUseCase.execute.mockResolvedValue(model);

    const result = await controller.update('model-id', { name: 'Corolla' });

    expect(updateModelUseCase.execute).toHaveBeenCalledWith('model-id', {
      name: 'Corolla',
    });
    expect(result).toEqual(model);
  });

  it('should delete a model', async () => {
    deleteModelUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.delete('model-id')).resolves.toBeUndefined();
    expect(deleteModelUseCase.execute).toHaveBeenCalledWith('model-id');
  });
});
