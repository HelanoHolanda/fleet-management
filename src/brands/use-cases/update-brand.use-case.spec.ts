import { ConflictException, NotFoundException } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';
import { UpdateBrandUseCase } from './update-brand.use-case';

describe('UpdateBrandUseCase', () => {
  let useCase: UpdateBrandUseCase;
  let brandsRepository: jest.Mocked<
    Pick<BrandsRepository, 'findById' | 'verifyNameExists' | 'update'>
  >;

  const brandId = '11111111-1111-4111-8111-111111111111';

  const brand: Brand = {
    id: brandId,
    name: 'Toyota',
    createdAt: new Date('2026-06-06T00:00:00.000Z'),
    updatedAt: new Date('2026-06-06T00:00:00.000Z'),
    createdBy: '33333333-3333-4333-8333-333333333333',
  };

  beforeEach(() => {
    brandsRepository = {
      findById: jest.fn(),
      verifyNameExists: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateBrandUseCase(
      brandsRepository as unknown as BrandsRepository,
    );
  });

  it('should update a brand when it exists and return response pattern', async () => {
    const updatedBrand = { ...brand, name: 'Honda' };
    brandsRepository.findById.mockResolvedValue(brand);
    brandsRepository.verifyNameExists.mockResolvedValue(false);
    brandsRepository.update.mockResolvedValue(updatedBrand);

    const result = await useCase.execute(brandId, { name: 'Honda' });

    expect(brandsRepository.findById).toHaveBeenCalledWith(brandId);
    expect(brandsRepository.verifyNameExists).toHaveBeenCalledWith('Honda');
    expect(brandsRepository.update).toHaveBeenCalledWith(brandId, {
      name: 'Honda',
    });
    expect(result).toEqual({
      message: 'Marca atualizada com sucesso.',
      data: {
        id: updatedBrand.id,
        name: updatedBrand.name,
        createdAt: updatedBrand.createdAt,
      },
    });
  });

  it('should throw NotFoundException when brand does not exist', async () => {
    brandsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(brandId, { name: 'Honda' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(brandsRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when brand name already exists', async () => {
    brandsRepository.findById.mockResolvedValue(brand);
    brandsRepository.verifyNameExists.mockResolvedValue(true);

    await expect(
      useCase.execute(brandId, { name: 'Honda' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(brandsRepository.update).not.toHaveBeenCalled();
  });
});
