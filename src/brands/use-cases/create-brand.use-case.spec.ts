import { ConflictException } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';
import { CreateBrandUseCase } from './create-brand.use-case';

describe('CreateBrandUseCase', () => {
  let useCase: CreateBrandUseCase;
  let brandsRepository: jest.Mocked<
    Pick<BrandsRepository, 'verifyNameExists' | 'create'>
  >;

  const userId = '33333333-3333-4333-8333-333333333333';

  const brand: Brand = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Toyota',
    createdAt: new Date('2026-06-06T00:00:00.000Z'),
    updatedAt: new Date('2026-06-06T00:00:00.000Z'),
    createdBy: userId,
  };

  beforeEach(() => {
    brandsRepository = {
      verifyNameExists: jest.fn(),
      create: jest.fn(),
    };

    useCase = new CreateBrandUseCase(
      brandsRepository as unknown as BrandsRepository,
    );
  });

  it('should create a brand with createdBy and return response pattern', async () => {
    brandsRepository.verifyNameExists.mockResolvedValue(false);
    brandsRepository.create.mockResolvedValue(brand);

    const result = await useCase.execute({ name: 'Toyota' }, userId);

    expect(brandsRepository.verifyNameExists).toHaveBeenCalledWith('Toyota');
    expect(brandsRepository.create).toHaveBeenCalledWith({
      name: 'Toyota',
      createdBy: userId,
    });
    expect(result).toEqual({
      message: 'Marca criada com sucesso.',
      data: {
        id: brand.id,
        name: brand.name,
        createdAt: brand.createdAt,
      },
    });
  });

  it('should throw ConflictException when brand name already exists', async () => {
    brandsRepository.verifyNameExists.mockResolvedValue(true);

    await expect(
      useCase.execute({ name: 'Toyota' }, userId),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(brandsRepository.create).not.toHaveBeenCalled();
  });
});
