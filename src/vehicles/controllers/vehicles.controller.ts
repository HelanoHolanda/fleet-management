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
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { CreateVehicleUseCase } from '../use-cases/create-vehicles.use-case';
import { DeleteVehicleUseCase } from '../use-cases/delete-vehicle.use-case';
import { FindAllVehiclesUseCase } from '../use-cases/find-all-vehicles.use-case';
import { UpdateVehicleUseCase } from '../use-cases/update-vehicle.use-case';
import { VehicleResponseDto } from '../dto/vehicle-response.dto';

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
  async create(
    @Body() dto: CreateVehicleDto,
    @CurrentUser() user: User,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.createVehicleUseCase.execute(dto, user.id);

    return {
      licensePlate: vehicle.licensePlate,
      chassis: vehicle.chassis,
      renavam: vehicle.renavam,
      year: vehicle.year,
      model: {
        name: vehicle.model.name,
      },
    };
  }

  @Get()
  async findAll() {
    return this.findAllVehiclesUseCase.execute();
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.updateVehicleUseCase.execute(id, dto);

    return {
      licensePlate: vehicle.licensePlate,
      chassis: vehicle.chassis,
      renavam: vehicle.renavam,
      year: vehicle.year,
      model: {
        name: vehicle.model.name,
      },
    };
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.deleteVehicleUseCase.execute(id);
  }
}
