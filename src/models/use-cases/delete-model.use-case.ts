import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class DeleteModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Id do modelo invalido.');
    }

    const model = await this.modelsRepository.findById(id);
    if (!model) throw new NotFoundException('Modelo nao encontrado.');

    const hasVehicles = await this.modelsRepository.hasVehicles(id);
    if (hasVehicles) {
      throw new ConflictException(
        'Nao e possivel remover um modelo que contem veiculos vinculados.',
      );
    }

    await this.modelsRepository.delete(id);
  }
}
