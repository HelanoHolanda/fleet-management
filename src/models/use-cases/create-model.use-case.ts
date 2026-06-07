import { Injectable, ConflictException } from '@nestjs/common';
import { CreateModelDto } from '../dto/create-model.dto';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class CreateModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(
    dto: CreateModelDto,
    createdBy?: string | null,
  ): Promise<{
    message: string;
    data: Partial<Model>;
  }> {
    const nameExists = await this.modelsRepository.verifyNameExists(dto.name);

    if (nameExists) {
      throw new ConflictException('Modelo já cadastrado com esse nome');
    }

    const model = await this.modelsRepository.create({
      ...dto,
      createdBy,
    });

    return {
      message: 'Modelo criado com sucesso',
      data: {
        id: model.id,
        name: model.name,
        createdAt: model.createdAt,
      },
    };
  }
}
