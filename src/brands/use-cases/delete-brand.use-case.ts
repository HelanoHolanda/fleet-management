import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { BrandsRepository } from '../repositories/brands.repository';

@Injectable()
export class DeleteBrandUseCase {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async execute(id: string): Promise<void> {
    if (!isUUID(id)) throw new BadRequestException('Id da marca inválido.');

    const brand = await this.brandsRepository.findById(id);
    if (!brand) throw new NotFoundException('Marca nao encontrada.');

    await this.brandsRepository.delete(id);
  }
}
