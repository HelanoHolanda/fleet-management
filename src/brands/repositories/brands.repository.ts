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

  async findAll(): Promise<Brand[]> {
    return this.repository.find({
      select: { id: true, name: true, models: { id: true, name: true } },
      relations: ['models'],
      order: {
        name: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Brand | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['models'],
    });
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.repository.findOne({ where: { name } });
  }

  async update(id: string, data: Partial<Brand>): Promise<Brand> {
    const brand = await this.findById(id);
    const updated = this.repository.merge(brand!, data);
    return this.repository.save(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
