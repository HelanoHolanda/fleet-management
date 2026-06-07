import { NotFoundException } from '@nestjs/common';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';
import { UpdateModelUseCase } from './update-model.use-case';

describe('UpdateModelUseCase', () => {
  let useCase: UpdateModelUseCase;
  let modelsRepository: jest.Mocked<
    Pick<ModelsRepository, 'findById' | 'verifyNameExists' | 'update'>
  >;

  beforeEach(() => {
    modelsRepository = {
      findById: jest.fn(),
      verifyNameExists: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateModelUseCase(
      modelsRepository as unknown as ModelsRepository,
    );
  });

  it('should update a model and return response pattern', async () => {
    const model: Model = {
      id: 'model-id',
      name: 'Hilux',
      createdAt: new Date('2026-06-05T00:00:00.000Z'),
      updatedAt: new Date('2026-06-05T00:00:00.000Z'),
      createdBy: 'user-id',
    };
    modelsRepository.findById.mockResolvedValue(model);
    modelsRepository.verifyNameExists.mockResolvedValue(false);
    modelsRepository.update.mockResolvedValue(model);

    const result = await useCase.execute('model-id', { name: 'Hilux' });

    expect(modelsRepository.update).toHaveBeenCalledWith('model-id', {
      name: 'Hilux',
    });
    expect(result).toEqual({
      message: 'Modelo atualizado com sucesso.',
      data: {
        id: model.id,
        name: model.name,
        createdAt: model.createdAt,
      },
    });
  });

  it('should throw NotFoundException when model does not exist', async () => {
    modelsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('model-id', { name: 'Hilux' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(modelsRepository.update).not.toHaveBeenCalled();
  });
});
