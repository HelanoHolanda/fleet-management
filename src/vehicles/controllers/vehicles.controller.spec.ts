import { Model } from '../../models/entities/model.entity';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleUseCase } from '../use-cases/create-vehicles.use-case';
import { DeleteVehicleUseCase } from '../use-cases/delete-vehicle.use-case';
import { FindAllVehiclesUseCase } from '../use-cases/find-all-vehicles.use-case';
import { UpdateVehicleUseCase } from '../use-cases/update-vehicle.use-case';
import { VehiclesController } from './vehicles.controller';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let createVehicleUseCase: jest.Mocked<Pick<CreateVehicleUseCase, 'execute'>>;
  let findAllVehiclesUseCase: jest.Mocked<
    Pick<FindAllVehiclesUseCase, 'execute'>
  >;
  let updateVehicleUseCase: jest.Mocked<Pick<UpdateVehicleUseCase, 'execute'>>;
  let deleteVehicleUseCase: jest.Mocked<Pick<DeleteVehicleUseCase, 'execute'>>;

  const user: User = {
    id: 'user-id',
    nickname: 'aivacol',
    name: 'Aivacol Admin',
    email: 'aivacol@aivacol.com',
    password: 'hashed-password',
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: null,
  };

  const model: Model = {
    id: 'model-id',
    name: 'Corolla',
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: 'user-id',
  };

  const vehicle: Vehicle = {
    id: 'vehicle-id',
    licensePlate: 'ABC1D23',
    chassis: '9BWZZZ377VT004251',
    renavam: '12345678901',
    year: 2024,
    modelId: 'model-id',
    model,
    createdAt: new Date('2026-06-05T00:00:00.000Z'),
    updatedAt: new Date('2026-06-05T00:00:00.000Z'),
    createdBy: 'user-id',
  };

  beforeEach(() => {
    createVehicleUseCase = { execute: jest.fn() };
    findAllVehiclesUseCase = { execute: jest.fn() };
    updateVehicleUseCase = { execute: jest.fn() };
    deleteVehicleUseCase = { execute: jest.fn() };

    controller = new VehiclesController(
      createVehicleUseCase as unknown as CreateVehicleUseCase,
      findAllVehiclesUseCase as unknown as FindAllVehiclesUseCase,
      updateVehicleUseCase as unknown as UpdateVehicleUseCase,
      deleteVehicleUseCase as unknown as DeleteVehicleUseCase,
    );
  });

  it('should create a vehicle using current user id', async () => {
    const response = {
      message: 'Veiculo criado com sucesso',
      data: {
        licensePlate: vehicle.licensePlate,
        chassis: vehicle.chassis,
        renavam: vehicle.renavam,
        year: vehicle.year,
        model: {
          id: model.id,
          name: model.name,
        },
      },
    };
    createVehicleUseCase.execute.mockResolvedValue(response);

    const dto = {
      licensePlate: 'ABC1D23',
      chassis: '9BWZZZ377VT004251',
      renavam: '12345678901',
      year: 2024,
      modelId: 'model-id',
    };

    const result = await controller.create(dto, user);

    expect(createVehicleUseCase.execute).toHaveBeenCalledWith(dto, 'user-id');
    expect(result).toEqual(response);
  });

  it('should list vehicles', async () => {
    const response = {
      items: [vehicle],
      total: 1,
      page: 1,
    };
    findAllVehiclesUseCase.execute.mockResolvedValue(response);

    await expect(controller.findAll()).resolves.toEqual(response);
  });

  it('should update a vehicle', async () => {
    const response = {
      message: 'Veiculo atualizado com sucesso',
      data: {
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        chassis: vehicle.chassis,
        renavam: vehicle.renavam,
        year: vehicle.year,
        model: {
          id: model.id,
          name: model.name,
        },
      },
    };
    updateVehicleUseCase.execute.mockResolvedValue(response);

    await expect(
      controller.update('vehicle-id', { licensePlate: 'ABC1D23' }),
    ).resolves.toEqual(response);
    expect(updateVehicleUseCase.execute).toHaveBeenCalledWith('vehicle-id', {
      licensePlate: 'ABC1D23',
    });
  });

  it('should delete a vehicle', async () => {
    const response = {
      message: 'Veiculo removido com sucesso.',
    };
    deleteVehicleUseCase.execute.mockResolvedValue(response);

    await expect(controller.delete('vehicle-id')).resolves.toEqual(response);
    expect(deleteVehicleUseCase.execute).toHaveBeenCalledWith('vehicle-id');
  });
});
