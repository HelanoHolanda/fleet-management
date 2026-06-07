import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';
import { FindModelsUseCase } from './find-models.use-case';

describe('FindModelsUseCase', () => {
  let useCase: FindModelsUseCase;
  let modelsRepository: jest.Mocked<Pick<ModelsRepository, 'findAll'>>;

  beforeEach(() => {
    modelsRepository = {
      findAll: jest.fn(),
    };

    useCase = new FindModelsUseCase(
      modelsRepository as unknown as ModelsRepository,
    );
  });

  it('should return paginated models', async () => {
    const model: Model = {
      id: 'model-id',
      name: 'Corolla',
      createdAt: new Date('2026-06-05T00:00:00.000Z'),
      updatedAt: new Date('2026-06-05T00:00:00.000Z'),
      createdBy: 'user-id',
    };
    const response = {
      items: [model],
      total: 1,
      page: 2,
    };
    modelsRepository.findAll.mockResolvedValue(response);

    await expect(useCase.execute(2, 5)).resolves.toEqual(response);
    expect(modelsRepository.findAll).toHaveBeenCalledWith(2, 5);
  });
});
