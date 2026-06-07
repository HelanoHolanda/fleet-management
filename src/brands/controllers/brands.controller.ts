import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../users/entities/user.entity';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { AssociateModelToBrandUseCase } from '../use-cases/associate-model-to-brand.use-case';
import { CreateBrandUseCase } from '../use-cases/create-brand.use-case';
import { DeleteBrandUseCase } from '../use-cases/delete-brand.use-case';
import { FindBrandsUseCase } from '../use-cases/find-all-brands.use-case';
import { UpdateBrandUseCase } from '../use-cases/update-brand.use-case';
import { AssociateModelToBrandDto } from '../dto/associate-model.dto';

@UseGuards(JwtAuthGuard)
@Controller('brands')
export class BrandsController {
  constructor(
    private readonly createBrandUseCase: CreateBrandUseCase,
    private readonly findBrandsUseCase: FindBrandsUseCase,
    private readonly updateBrandUseCase: UpdateBrandUseCase,
    private readonly deleteBrandUseCase: DeleteBrandUseCase,
    private readonly associateModelToBrandUseCase: AssociateModelToBrandUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateBrandDto, @CurrentUser() user: User) {
    return this.createBrandUseCase.execute(dto, user.id);
  }

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.findBrandsUseCase.execute(Number(page), Number(limit));
  }

  @Patch('/associate-model')
  async associateModel(@Body() dto: AssociateModelToBrandDto) {
    return this.associateModelToBrandUseCase.execute(dto.brandId, dto.modelId);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    return this.updateBrandUseCase.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.deleteBrandUseCase.execute(id);
  }
}
