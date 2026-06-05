import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';
import { CreateModelUseCase } from './create-model.use-case';

describe('CreateModelUseCase', () => {
  let useCase: CreateModelUseCase;
  let modelsRepository: jest.Mocked<Pick<ModelsRepository, 'create'>>;

  const model: Model = {
    id: 'model-id',
    name: 'Corolla',
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: 'user-id',
  };

  beforeEach(() => {
    modelsRepository = {
      create: jest.fn(),
    };

    useCase = new CreateModelUseCase(
      modelsRepository as unknown as ModelsRepository,
    );
  });

  it('should create a model with createdBy', async () => {
    modelsRepository.create.mockResolvedValue(model);

    const result = await useCase.execute({ name: 'Corolla' }, 'user-id');

    expect(modelsRepository.create).toHaveBeenCalledWith({
      name: 'Corolla',
      createdBy: 'user-id',
    });
    expect(result).toEqual(model);
  });

  it('should throw ConflictException when model name already exists', async () => {
    const error = Object.assign(
      new QueryFailedError('', [], {
        code: '23505',
      } as unknown as Error),
      { code: '23505' },
    );
    modelsRepository.create.mockRejectedValue(error);

    await expect(
      useCase.execute({ name: 'Corolla' }, 'user-id'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should rethrow unknown errors', async () => {
    const error = new Error('database unavailable');
    modelsRepository.create.mockRejectedValue(error);

    await expect(
      useCase.execute({ name: 'Corolla' }, 'user-id'),
    ).rejects.toThrow(error);
  });
});
