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

  it('should return all models', async () => {
    const models: Model[] = [
      {
        id: 'model-id',
        name: 'Corolla',
        createdAt: new Date('2026-06-05T00:00:00.000Z'),
        updatedAt: new Date('2026-06-05T00:00:00.000Z'),
        createdBy: 'user-id',
      },
    ];
    modelsRepository.findAll.mockResolvedValue(models);

    await expect(useCase.execute()).resolves.toEqual(models);
    expect(modelsRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
