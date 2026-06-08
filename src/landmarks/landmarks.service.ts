import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { withDbRetry } from '../common/db-retry.util.js';
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
    const offset = (page - 1) * limit;

    const baseQb = this.createFilteredQuery(query);
    const total = await withDbRetry(() => baseQb.clone().getCount());

    if (total === 0) {
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const idRows = await withDbRetry(() =>
      baseQb
        .clone()
        .select('landmark.id')
        .orderBy('landmark.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany(),
    );

    const ids = idRows.map((landmark) => landmark.id);

    if (ids.length === 0) {
      return {
        items: [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const items = await withDbRetry(() =>
      this.landmarkRepository
        .createQueryBuilder('landmark')
        .leftJoinAndSelect('landmark.era', 'era')
        .leftJoinAndSelect('landmark.style', 'style')
        .leftJoinAndSelect('landmark.purpose', 'purpose')
        .leftJoinAndSelect('landmark.legalStatus', 'legalStatus')
        .leftJoinAndSelect('landmark.categories', 'categories')
        .where('landmark.id IN (:...ids)', { ids })
        .orderBy('landmark.createdAt', 'DESC')
        .getMany(),
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(slug: string) {
    const landmark = await withDbRetry(() =>
      this.landmarkRepository.findOne({
        where: { id: slug },
        relations: [
          'era',
          'style',
          'architect',
          'purpose',
          'legalStatus',
          'categories',
        ],
      }),
    );

    if (!landmark) {
      throw new NotFoundException(`Landmark with slug "${slug}" not found`);
    }

    return landmark;
  }

  private createFilteredQuery(
    query: FindLandmarksQueryDto,
  ): SelectQueryBuilder<Landmark> {
    const qb = this.landmarkRepository.createQueryBuilder('landmark');

    if (query.eraId) {
      qb.andWhere('landmark.eraId = :eraId', { eraId: query.eraId });
    }

    if (query.categoryId) {
      qb.andWhere(
        `landmark.id IN (
          SELECT lc.landmark_id
          FROM landmark_categories lc
          WHERE lc.category_id = :categoryId
        )`,
        { categoryId: query.categoryId },
      );
    }

    if (query.search) {
      qb.andWhere(
        '(landmark.title ILIKE :search OR landmark.shortDescription ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    return qb;
  }
}
