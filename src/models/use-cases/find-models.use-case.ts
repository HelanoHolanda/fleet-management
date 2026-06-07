import { Injectable } from '@nestjs/common';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class FindModelsUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(
    page = 1,
    limit = 10,
  ): Promise<{
    items: Partial<Model>[];
    total: number;
    page: number;
  }> {
    return await this.modelsRepository.findAll(page, limit);
  }
}
