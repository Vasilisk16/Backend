import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindLandmarksQueryDto } from './dto/find-landmarks-query.dto.js';
import { Landmark } from './landmark.entity.js';

@Injectable()
export class LandmarksService {
  constructor(
    @InjectRepository(Landmark)
    private readonly landmarkRepository: Repository<Landmark>,
  ) {}

  async findAll(query: FindLandmarksQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const qb = this.landmarkRepository
      .createQueryBuilder('landmark')
      .leftJoinAndSelect('landmark.era', 'era')
      .leftJoinAndSelect('landmark.style', 'style')
      .leftJoinAndSelect('landmark.purpose', 'purpose')
      .leftJoinAndSelect('landmark.legalStatus', 'legalStatus')
      .leftJoinAndSelect('landmark.categories', 'categories')
      .orderBy('landmark.createdAt', 'DESC');

    if (query.eraId) {
      qb.andWhere('era.id = :eraId', { eraId: query.eraId });
    }

    if (query.categoryId) {
      qb.andWhere('categories.id = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(landmark.title ILIKE :search OR landmark.shortDescription ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(slug: string) {
    const landmark = await this.landmarkRepository.findOne({
      where: { slug },
      relations: [
        'era',
        'style',
        'architect',
        'purpose',
        'legalStatus',
        'categories',
      ],
    });

    if (!landmark) {
      throw new NotFoundException(`Landmark with slug "${slug}" not found`);
    }

    return landmark;
  }
}
