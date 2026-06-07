import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandsRepository } from '../repositories/brands.repository';

@Injectable()
export class DeleteBrandUseCase {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const brand = await this.brandsRepository.findById(id);

    if (!brand) {
      throw new NotFoundException('Marca nao encontrada.');
    }

    await this.brandsRepository.delete(id);

    return {
      message: 'Marca removida com sucesso.',
    };
  }
}
