import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../users/entities/user.entity';
import { CreateModelDto } from '../dto/create-model.dto';
import { UpdateModelDto } from '../dto/update-model.dto';
import { Model } from '../entities/model.entity';
import { CreateModelUseCase } from '../use-cases/create-model.use-case';
import { DeleteModelUseCase } from '../use-cases/delete-model.use-case';
import { FindModelsUseCase } from '../use-cases/find-models.use-case';
import { UpdateModelUseCase } from '../use-cases/update-model.use-case';

@Controller('models')
@UseGuards(JwtAuthGuard)
export class ModelsController {
  constructor(
    private readonly createModelUseCase: CreateModelUseCase,
    private readonly findModelsUseCase: FindModelsUseCase,
    private readonly updateModelUseCase: UpdateModelUseCase,
    private readonly deleteModelUseCase: DeleteModelUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateModelDto,
    @CurrentUser() currentUser: User,
  ): Promise<Model> {
    return this.createModelUseCase.execute(dto, currentUser.id);
  }

  @Get()
  async findAll(): Promise<Model[]> {
    return this.findModelsUseCase.execute();
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateModelDto,
  ): Promise<Model> {
    return this.updateModelUseCase.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteModelUseCase.execute(id);
  }
}
