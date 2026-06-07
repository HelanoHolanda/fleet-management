import { Injectable } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';

@Injectable()
export class FindBrandsUseCase {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async execute(
    page = 1,
    limit = 10,
  ): Promise<{
    items: Partial<Brand>[];
    total: number;
    page: number;
  }> {
    return this.brandsRepository.findAll(page, limit);
  }
}
