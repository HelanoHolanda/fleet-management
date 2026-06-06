import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';
import { CreateBrandUseCase } from './create-brand.use-case';

describe('CreateBrandUseCase', () => {
  let useCase: CreateBrandUseCase;
  let brandsRepository: jest.Mocked<Pick<BrandsRepository, 'create'>>;

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
      create: jest.fn(),
    };

    useCase = new CreateBrandUseCase(
      brandsRepository as unknown as BrandsRepository,
    );
  });

  it('should create a brand with createdBy', async () => {
    brandsRepository.create.mockResolvedValue(brand);

    const result = await useCase.execute({ name: 'Toyota' }, userId);

    expect(brandsRepository.create).toHaveBeenCalledWith({
      name: 'Toyota',
      createdBy: userId,
    });
    expect(result).toEqual(brand);
  });

  it('should throw ConflictException when brand name already exists', async () => {
    const error = Object.assign(
      new QueryFailedError('', [], { number: 2627 } as unknown as Error),
      { number: 2627 },
    );
    brandsRepository.create.mockRejectedValue(error);

    await expect(
      useCase.execute({ name: 'Toyota' }, userId),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should rethrow unknown errors', async () => {
    const error = new Error('database unavailable');
    brandsRepository.create.mockRejectedValue(error);

    await expect(useCase.execute({ name: 'Toyota' }, userId)).rejects.toThrow(
      error,
    );
  });
});
