import { Injectable } from '@nestjs/common';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class FindModelsUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(): Promise<Model[]> {
    return this.modelsRepository.findAll();
  }
}
