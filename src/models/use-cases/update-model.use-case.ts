import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateModelDto } from '../dto/update-model.dto';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class UpdateModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(id: string, dto: UpdateModelDto): Promise<Model> {
    const existingModel = await this.modelsRepository.findById(id);

    if (!existingModel) {
      throw new NotFoundException('Modelo não encontrado.');
    }

    return this.modelsRepository.update(id, dto);
  }
}
