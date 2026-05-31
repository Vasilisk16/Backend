import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindLandmarksQueryDto } from './dto/find-landmarks-query.dto';
import { Landmark } from './landmark.entity';
import { LandmarksService } from './landmarks.service';

describe('LandmarksService', () => {
  let service: LandmarksService;
  let repository: jest.Mocked<Repository<Landmark>>;

  const mockLandmark = {
    slug: 'gostinye-dvory',
    title: 'Гостиные дворы',
    shortDescription: 'Test',
    yearOfConstruction: '1684 г.',
  } as Landmark;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandmarksService,
        {
          provide: getRepositoryToken(Landmark),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(LandmarksService);
    repository = module.get(getRepositoryToken(Landmark));
  });

  it('should return paginated landmarks', async () => {
    const qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockLandmark], 1]),
    };

    repository.createQueryBuilder.mockReturnValue(qb as never);

    const query: FindLandmarksQueryDto = { page: 1, limit: 12 };
    const result = await service.findAll(query);

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('should apply era filter', async () => {
    const qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    repository.createQueryBuilder.mockReturnValue(qb as never);

    await service.findAll({ eraId: 1, page: 1, limit: 12 });

    expect(qb.andWhere).toHaveBeenCalledWith('era.id = :eraId', { eraId: 1 });
  });

  it('should return landmark by slug', async () => {
    repository.findOne.mockResolvedValue(mockLandmark);

    const result = await service.findOne(mockLandmark.slug);

    expect(result).toEqual(mockLandmark);
  });

  it('should throw NotFoundException when landmark missing', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('missing-slug')).rejects.toThrow(
      NotFoundException,
    );
  });
});
