import { Repository } from 'typeorm';
import { Model } from '../entities/model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelsRepository {
  constructor(
    @InjectRepository(Model)
    private readonly repository: Repository<Model>,
  ) {}

  async create(model: Partial<Model>): Promise<Model> {
    // metodo para criar um novo modelo
    const newModel = this.repository.create(model);
    return this.repository.save(newModel);
  }

  async findAll(): Promise<Model[]> {
    // metodo para encontrar todos os modelos
    const list = this.repository.find({
      select: {
        id: true,
        name: true,
      },
    });

    return list;
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
}
