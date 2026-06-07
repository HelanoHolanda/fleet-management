import { Brand } from '../entities/brand.entity';
import { BrandsRepository } from '../repositories/brands.repository';
import { FindBrandsUseCase } from './find-all-brands.use-case';

describe('FindBrandsUseCase', () => {
  let useCase: FindBrandsUseCase;
  let brandsRepository: jest.Mocked<Pick<BrandsRepository, 'findAll'>>;

  const brand: Brand = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Toyota',
    createdAt: new Date('2026-06-06T00:00:00.000Z'),
    updatedAt: new Date('2026-06-06T00:00:00.000Z'),
    createdBy: '33333333-3333-4333-8333-333333333333',
  };

  beforeEach(() => {
    brandsRepository = {
      findAll: jest.fn(),
    };

    useCase = new FindBrandsUseCase(
      brandsRepository as unknown as BrandsRepository,
    );
  });

  it('should list paginated brands', async () => {
    const response = {
      items: [brand],
      total: 1,
      page: 2,
    };
    brandsRepository.findAll.mockResolvedValue(response);

    await expect(useCase.execute(2, 5)).resolves.toEqual(response);
    expect(brandsRepository.findAll).toHaveBeenCalledWith(2, 5);
  });
});
