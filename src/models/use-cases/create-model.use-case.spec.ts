import { ConflictException } from '@nestjs/common';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';
import { CreateModelUseCase } from './create-model.use-case';

describe('CreateModelUseCase', () => {
  let useCase: CreateModelUseCase;
  let modelsRepository: jest.Mocked<
    Pick<ModelsRepository, 'verifyNameExists' | 'create'>
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
      verifyNameExists: jest.fn(),
      create: jest.fn(),
    };

    useCase = new CreateModelUseCase(
      modelsRepository as unknown as ModelsRepository,
    );
  });

  it('should create a model with createdBy and return response pattern', async () => {
    modelsRepository.verifyNameExists.mockResolvedValue(false);
    modelsRepository.create.mockResolvedValue(model);

    const result = await useCase.execute({ name: 'Corolla' }, 'user-id');

    expect(modelsRepository.verifyNameExists).toHaveBeenCalledWith('Corolla');
    expect(modelsRepository.create).toHaveBeenCalledWith({
      name: 'Corolla',
      createdBy: 'user-id',
    });
    expect(result).toEqual({
      message: 'Modelo criado com sucesso',
      data: {
        id: model.id,
        name: model.name,
        createdAt: model.createdAt,
      },
    });
  });

  it('should throw ConflictException when model name already exists', async () => {
    modelsRepository.verifyNameExists.mockResolvedValue(true);

    await expect(
      useCase.execute({ name: 'Corolla' }, 'user-id'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(modelsRepository.create).not.toHaveBeenCalled();
  });
});
