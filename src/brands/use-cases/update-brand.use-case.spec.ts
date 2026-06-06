import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';
import { UpdateBrandUseCase } from './update-brand.use-case';

describe('UpdateBrandUseCase', () => {
  let useCase: UpdateBrandUseCase;
  let brandsRepository: jest.Mocked<
    Pick<BrandsRepository, 'findById' | 'update'>
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
      update: jest.fn(),
    };

    useCase = new UpdateBrandUseCase(
      brandsRepository as unknown as BrandsRepository,
    );
  });

  it('should update a brand when it exists', async () => {
    const updatedBrand = { ...brand, name: 'Honda' };
    brandsRepository.findById.mockResolvedValue(brand);
    brandsRepository.update.mockResolvedValue(updatedBrand);

    const result = await useCase.execute(brandId, { name: 'Honda' });

    expect(brandsRepository.findById).toHaveBeenCalledWith(brandId);
    expect(brandsRepository.update).toHaveBeenCalledWith(brandId, {
      name: 'Honda',
    });
    expect(result).toEqual(updatedBrand);
  });

  it('should throw NotFoundException when brand does not exist', async () => {
    brandsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(brandId, { name: 'Honda' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(brandsRepository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when id is not a valid uuid', async () => {
    await expect(
      useCase.execute('id-invalido', { name: 'Honda' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(brandsRepository.findById).not.toHaveBeenCalled();
    expect(brandsRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when brand name already exists', async () => {
    const error = Object.assign(
      new QueryFailedError('', [], { number: 2601 } as unknown as Error),
      { number: 2601 },
    );
    brandsRepository.findById.mockResolvedValue(brand);
    brandsRepository.update.mockRejectedValue(error);

    await expect(
      useCase.execute(brandId, { name: 'Honda' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
