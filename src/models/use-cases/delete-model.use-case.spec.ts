import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';
import { DeleteModelUseCase } from './delete-model.use-case';

describe('DeleteModelUseCase', () => {
  let useCase: DeleteModelUseCase;
  let modelsRepository: jest.Mocked<
    Pick<ModelsRepository, 'findById' | 'delete'>
  >;

  const modelId = '96791b2d-3083-4055-ba55-8d9b8ba6aa6b';

  const model: Model = {
    id: modelId,
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

    await expect(useCase.execute(modelId)).resolves.toBeUndefined();
    expect(modelsRepository.findById).toHaveBeenCalledWith(modelId);
    expect(modelsRepository.delete).toHaveBeenCalledWith(modelId);
  });

  it('should throw NotFoundException when model does not exist', async () => {
    modelsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(modelId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(modelsRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when id is not a valid uuid', async () => {
    await expect(useCase.execute('id-invalido')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(modelsRepository.findById).not.toHaveBeenCalled();
    expect(modelsRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when model has linked vehicles', async () => {
    const error = Object.assign(
      new QueryFailedError('', [], { number: 547 } as unknown as Error),
      { number: 547 },
    );

    modelsRepository.findById.mockResolvedValue(model);
    modelsRepository.delete.mockRejectedValue(error);

    await expect(useCase.execute(modelId)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
