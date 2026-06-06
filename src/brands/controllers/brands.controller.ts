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
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../users/entities/user.entity';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { AssociateModelToBrandUseCase } from '../use-cases/associate-model-to-brand.use-case';
import { CreateBrandUseCase } from '../use-cases/create-brand.use-case';
import { DeleteBrandUseCase } from '../use-cases/delete-brand.use-case';
import { FindBrandsUseCase } from '../use-cases/find-all-brands.use-case';
import { UpdateBrandUseCase } from '../use-cases/update-brand.use-case';

@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(
    private readonly createBrandUseCase: CreateBrandUseCase,
    private readonly findBrandsUseCase: FindBrandsUseCase,
    private readonly updateBrandUseCase: UpdateBrandUseCase,
    private readonly deleteBrandUseCase: DeleteBrandUseCase,
    private readonly associateModelToBrandUseCase: AssociateModelToBrandUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateBrandDto, @CurrentUser() currentUser: User) {
    const brand = await this.createBrandUseCase.execute(dto, currentUser.id);
    return ResponseDto.success(brand, 'Marca criada com sucesso.');
  }

  @Get()
  async findAll() {
    const brands = await this.findBrandsUseCase.execute();
    return ResponseDto.success(brands, 'Marcas consultadas com sucesso.');
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    const brand = await this.updateBrandUseCase.execute(id, dto);
    return ResponseDto.success(brand, 'Marca atualizada com sucesso.');
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.deleteBrandUseCase.execute(id);
    return ResponseDto.success(null, 'Marca removida com sucesso.');
  }

  @Patch(':brandId/models/:modelId')
  async associateModel(
    @Param('brandId', new ParseUUIDPipe({ version: '4' })) brandId: string,
    @Param('modelId', new ParseUUIDPipe({ version: '4' })) modelId: string,
  ) {
    const model = await this.associateModelToBrandUseCase.execute(
      brandId,
      modelId,
    );
    return ResponseDto.success(model, 'Modelo associado a marca com sucesso.');
  }
}
