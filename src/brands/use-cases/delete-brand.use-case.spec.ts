import { NotFoundException } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';
import { DeleteBrandUseCase } from './delete-brand.use-case';

describe('DeleteBrandUseCase', () => {
  let useCase: DeleteBrandUseCase;
  let brandsRepository: jest.Mocked<
    Pick<BrandsRepository, 'findById' | 'delete'>
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
      delete: jest.fn(),
    };

    useCase = new DeleteBrandUseCase(
      brandsRepository as unknown as BrandsRepository,
    );
  });

  it('should delete a brand when it exists and return response pattern', async () => {
    brandsRepository.findById.mockResolvedValue(brand);
    brandsRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute(brandId)).resolves.toEqual({
      message: 'Marca removida com sucesso.',
    });
    expect(brandsRepository.findById).toHaveBeenCalledWith(brandId);
    expect(brandsRepository.delete).toHaveBeenCalledWith(brandId);
  });

  it('should throw NotFoundException when brand does not exist', async () => {
    brandsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(brandId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(brandsRepository.delete).not.toHaveBeenCalled();
  });
});
