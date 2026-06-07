import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';

@Injectable()
export class CreateBrandUseCase {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async execute(
    dto: CreateBrandDto,
    createdBy?: string | null,
  ): Promise<{
    message: string;
    data: Partial<Brand>;
  }> {
    const nameExists = await this.brandsRepository.verifyNameExists(dto.name);

    if (nameExists) {
      throw new ConflictException('Marca ja cadastrada com esse nome.');
    }

    const brand = await this.brandsRepository.create({
      ...dto,
      createdBy,
    });

    return {
      message: 'Marca criada com sucesso.',
      data: {
        id: brand.id,
        name: brand.name,
        createdAt: brand.createdAt,
      },
    };
  }
}
