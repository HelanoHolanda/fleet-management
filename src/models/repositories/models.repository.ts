import { Repository } from 'typeorm';
import { Model } from '../entities/model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Injectable()
export class ModelsRepository {
  constructor(
    @InjectRepository(Model)
    private readonly repository: Repository<Model>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(model: Partial<Model>): Promise<Model> {
    // metodo para criar um novo modelo
    const newModel = this.repository.create(model);
    return this.repository.save(newModel);
  }

  async verifyNameExists(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    items: Partial<Model>[];
    total: number;
    page: number;
  }> {
    const [items, total] = await this.repository.findAndCount({
      select: {
        id: true,
        name: true,
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
  async update(id: string, updateData: Partial<Model>): Promise<Model> {
    // metodo para atualizar um modelo existente
    const model = await this.repository.findOne({ where: { id } });
    if (!model) {
      throw new Error('Model not found');
    }
    Object.assign(model, updateData);
    return this.repository.save(model);
  }

  async delete(id: string): Promise<void> {
    // metodo para deletar um modelo
    await this.repository.delete(id);
  }

  async findByName(name: string): Promise<Model | null> {
    return this.repository.findOne({
      where: {
        name,
      },
    });
  }

  async findById(id: string): Promise<Model | null> {
    return this.repository.findOne({
      where: { id: id },
    });
  }

  async assignBrand(id: string, brandId: string): Promise<Model> {
    await this.repository.update(id, { brandId });
    const model = await this.repository.findOne({
      where: { id },
      relations: ['brand'],
    });

    if (!model) {
      throw new Error('Model not found');
    }

    return model;
  }

  async hasVehicles(modelId: string): Promise<boolean> {
    const verify = await this.vehicleRepository.find({
      where: { modelId: modelId },
    });
    return verify.length > 0;
  }
}
