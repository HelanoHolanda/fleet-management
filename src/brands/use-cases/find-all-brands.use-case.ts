import { Injectable } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';

@Injectable()
export class FindBrandsUseCase {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async execute(): Promise<Brand[]> {
    return this.brandsRepository.findAll();
  }
}
