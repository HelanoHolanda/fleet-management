import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ModelsRepository } from '../repositories/models.repository';

interface DatabaseError extends QueryFailedError {
  code: string;
}

@Injectable()
export class DeleteModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(id: string): Promise<void> {
    const model = await this.modelsRepository.findById(id);

    if (!model) {
      throw new NotFoundException('Modelo nao encontrado.');
    }

    try {
      await this.modelsRepository.delete(id);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as DatabaseError).code === '23503'
      ) {
        throw new ConflictException(
          'Nao e possivel remover um modelo que contem veiculos vinculados.',
        );
      }

      throw error;
    }
  }
}
