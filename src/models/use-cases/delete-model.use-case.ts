import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class DeleteModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const model = await this.modelsRepository.findById(id);

    if (!model) {
      throw new NotFoundException('Modelo não encontrado.');
    }

    const hasVehicles = await this.modelsRepository.hasVehicles(id);

    if (hasVehicles) {
      throw new ConflictException(
        'Não é possível remover um modelo que contém veículos vinculados.',
      );
    }

    await this.modelsRepository.delete(id);

    return {
      message: 'Modelo removido com sucesso.',
    };
  }
}
