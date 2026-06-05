import { Injectable } from '@nestjs/common';
import { UpdateModelDto } from '../dto/update-model.dto';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';

@Injectable()
export class UpdateModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(id: string, dto: UpdateModelDto): Promise<Model> {
    return this.modelsRepository.update(id, dto);
  }
}
