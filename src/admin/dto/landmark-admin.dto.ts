import { AdminField } from 'nestjs-dj-admin';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';
import { slugPattern } from '../../common/slug.util.js';

const categoryRelationField = () =>
  AdminField({
    label: 'Категории',
    relation: {
      kind: 'many-to-many',
      option: { resource: 'categories', labelField: 'name', valueField: 'id' },
    },
  });

export class CreateLandmarkDto {
  @IsString()
  @MaxLength(150)
  @Matches(slugPattern, {
    message: 'id must contain only lowercase latin letters, numbers and hyphens',
  })
  id: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  subtitle?: string;

  @IsString()
  shortDescription: string;

  @IsString()
  fullDescription: string;

  @IsString()
  @MaxLength(50)
  yearOfConstruction: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @IsInt()
  eraId: number;

  @IsInt()
  styleId: number;

  @IsOptional()
  @IsInt()
  architectId?: number;

  @IsInt()
  purposeId: number;

  @IsInt()
  legalStatusId: number;

  @categoryRelationField()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  categories?: number[];
}

export class UpdateLandmarkDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Matches(slugPattern, {
    message: 'id must contain only lowercase latin letters, numbers and hyphens',
  })
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  subtitle?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  yearOfConstruction?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  eraId?: number;

  @IsOptional()
  @IsInt()
  styleId?: number;

  @IsOptional()
  @IsInt()
  architectId?: number;

  @IsOptional()
  @IsInt()
  purposeId?: number;

  @IsOptional()
  @IsInt()
  legalStatusId?: number;

  @categoryRelationField()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  categories?: number[];
}
