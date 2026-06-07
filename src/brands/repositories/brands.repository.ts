import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class BrandsRepository {
  constructor(
    @InjectRepository(Brand)
    private readonly repository: Repository<Brand>,
  ) {}

  async create(brand: Partial<Brand>): Promise<Brand> {
    const newBrand = this.repository.create(brand);
    return this.repository.save(newBrand);
  }

  async verifyNameExists(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    items: Partial<Brand>[];
    total: number;
    page: number;
  }> {
    const [items, total] = await this.repository.findAndCount({
      select: {
        id: true,
        name: true,
        models: {
          id: true,
          name: true,
        },
      },
      relations: {
        models: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
    };
  }

  async findById(id: string): Promise<Brand | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.repository.findOne({ where: { name } });
  }

  async update(id: string, data: Partial<Brand>): Promise<Brand> {
    const brand = await this.repository.findOne({ where: { id } });
    if (!brand) {
      throw new Error('Brand not found');
    }

    Object.assign(brand, data);
    await this.repository.save(brand);
    return this.findById(id) as Promise<Brand>;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
