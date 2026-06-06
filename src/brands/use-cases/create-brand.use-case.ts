import { ConflictException, Injectable } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';

interface DatabaseError extends QueryFailedError {
  number?: number;
}

@Injectable()
export class CreateBrandUseCase {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async execute(
    dto: CreateBrandDto,
    createdBy?: string | null,
  ): Promise<Brand> {
    try {
      return await this.brandsRepository.create({
        ...dto,
        createdBy,
      });
    } catch (error) {
      const databaseError = error as DatabaseError;

      if (
        error instanceof QueryFailedError &&
        (databaseError.number === 2601 || databaseError.number === 2627)
      ) {
        throw new ConflictException(
          'Ja existe uma marca cadastrada com esse nome.',
        );
      }

      throw error;
    }
  }
}
