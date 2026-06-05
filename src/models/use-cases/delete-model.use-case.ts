import { Injectable } from '@nestjs/common';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class DeleteModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(id: string): Promise<void> {
    await this.modelsRepository.delete(id);
  }
}
