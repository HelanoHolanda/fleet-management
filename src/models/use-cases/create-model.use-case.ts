import { ConflictException, Injectable } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CreateModelDto } from '../dto/create-model.dto';
import { Model } from '../entities/model.entity';
import { ModelsRepository } from '../repositories/models.repository';

interface DatabaseError extends QueryFailedError {
  code: string;
}

@Injectable()
export class CreateModelUseCase {
  constructor(private readonly modelsRepository: ModelsRepository) {}

  async execute(
    dto: CreateModelDto,
    createdBy?: string | null,
  ): Promise<Model> {
    try {
      return await this.modelsRepository.create({
        ...dto,
        createdBy,
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as DatabaseError).code === '23505'
      ) {
        throw new ConflictException(
          'Já existe um modelo cadastrado com esse nome.',
        );
      }

      throw error;
    }
  }
}
