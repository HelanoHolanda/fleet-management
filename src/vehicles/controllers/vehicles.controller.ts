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
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CreateVehicleUseCase } from '../use-cases/create-vehicles.use-case';
import { DeleteVehicleUseCase } from '../use-cases/delete-vehicle.use-case';
import { FindAllVehiclesUseCase } from '../use-cases/find-all-vehicles.use-case';
import { UpdateVehicleUseCase } from '../use-cases/update-vehicle.use-case';

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly findAllVehiclesUseCase: FindAllVehiclesUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateVehicleDto, @CurrentUser() user: User) {
    return await this.createVehicleUseCase.execute(dto, user.id);
  }

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.findAllVehiclesUseCase.execute(Number(page), Number(limit));
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return await this.updateVehicleUseCase.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.deleteVehicleUseCase.execute(id);
  }
}
