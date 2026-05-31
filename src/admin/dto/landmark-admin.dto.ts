import { IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateLandmarkDto {
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
}

export class UpdateLandmarkDto {
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
}
