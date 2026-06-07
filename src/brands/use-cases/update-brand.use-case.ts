import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';

@Injectable()
export class UpdateBrandUseCase {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async execute(
    id: string,
    dto: UpdateBrandDto,
  ): Promise<{
    message: string;
    data: Partial<Brand>;
  }> {
    const brand = await this.brandsRepository.findById(id);

    if (!brand?.id) {
      throw new NotFoundException('Marca nao encontrada.');
    }

    if (dto.name && dto.name !== brand.name) {
      const nameExists = await this.brandsRepository.verifyNameExists(dto.name);

      if (nameExists) {
        throw new ConflictException('Marca ja cadastrada com esse nome.');
      }
    }

    const updatedBrand = await this.brandsRepository.update(id, dto);

    return {
      message: 'Marca atualizada com sucesso.',
      data: {
        id: updatedBrand.id,
        name: updatedBrand.name,
        createdAt: updatedBrand.createdAt,
      },
    };
  }
}
