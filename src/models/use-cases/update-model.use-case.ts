import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateModelDto } from '../dto/update-model.dto';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class UpdateModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(
    id: string,
    dto: UpdateModelDto,
  ): Promise<{
    message: string;
    data: Partial<Model>;
  }> {
    const idModelExists = await this.modelsRepository.findById(id);

    if (!idModelExists) {
      throw new NotFoundException('Modelo não encontrado.');
    }

    const nameExists = await this.modelsRepository.verifyNameExists(dto.name!);

    if (nameExists) {
      throw new NotFoundException('Modelo já cadastrado com esse nome.');
    }

    const updatedModel = await this.modelsRepository.update(id, dto);

    return {
      message: 'Modelo atualizado com sucesso.',
      data: {
        id: updatedModel.id,
        name: updatedModel.name,
        createdAt: updatedModel.createdAt,
      },
    };
  }
}
