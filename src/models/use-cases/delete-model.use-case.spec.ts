import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';
import { DeleteModelUseCase } from './delete-model.use-case';

describe('DeleteModelUseCase', () => {
  let useCase: DeleteModelUseCase;
  let modelsRepository: jest.Mocked<
    Pick<ModelsRepository, 'findById' | 'delete'>
  >;

  const model: Model = {
    id: 'model-id',
    name: 'Corolla',
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: 'user-id',
  };

  beforeEach(() => {
    modelsRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteModelUseCase(
      modelsRepository as unknown as ModelsRepository,
    );
  });

  it('should delete a model when it exists', async () => {
    modelsRepository.findById.mockResolvedValue(model);
    modelsRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute('model-id')).resolves.toBeUndefined();
    expect(modelsRepository.findById).toHaveBeenCalledWith('model-id');
    expect(modelsRepository.delete).toHaveBeenCalledWith('model-id');
  });

  it('should throw NotFoundException when model does not exist', async () => {
    modelsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('model-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(modelsRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when model has linked vehicles', async () => {
    const error = Object.assign(
      new QueryFailedError('', [], { code: '23503' } as unknown as Error),
      { code: '23503' },
    );

    modelsRepository.findById.mockResolvedValue(model);
    modelsRepository.delete.mockRejectedValue(error);

    await expect(useCase.execute('model-id')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
