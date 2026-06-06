import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';
import { isUUID } from 'class-validator';

interface DatabaseError extends QueryFailedError {
  number?: number;
}

@Injectable()
export class UpdateBrandUseCase {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async execute(id: string, dto: UpdateBrandDto): Promise<Brand> {
    if (!isUUID(id.toLowerCase())) {
      throw new NotFoundException('Marca nao encontrada.');
    }

    const brand = await this.brandsRepository.findById(id);
    if (!brand) throw new NotFoundException('Marca nao encontrada.');

    try {
      return await this.brandsRepository.update(id, dto);
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
