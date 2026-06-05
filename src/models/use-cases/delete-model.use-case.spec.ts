import { ModelsRepository } from '../repositories/models.repository';
import { DeleteModelUseCase } from './delete-model.use-case';

describe('DeleteModelUseCase', () => {
  let useCase: DeleteModelUseCase;
  let modelsRepository: jest.Mocked<Pick<ModelsRepository, 'delete'>>;

  beforeEach(() => {
    modelsRepository = {
      delete: jest.fn(),
    };

    useCase = new DeleteModelUseCase(
      modelsRepository as unknown as ModelsRepository,
    );
  });

  it('should delete a model', async () => {
    modelsRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute('model-id')).resolves.toBeUndefined();
    expect(modelsRepository.delete).toHaveBeenCalledWith('model-id');
  });
});
