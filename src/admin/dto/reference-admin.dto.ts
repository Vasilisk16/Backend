import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReferenceDto {
  @IsString()
  @MaxLength(150)
  name: string;
}

export class UpdateReferenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;
}

export class CreateEraDto extends CreateReferenceDto {
  @IsInt()
  sortOrder: number;
}

export class UpdateEraDto extends UpdateReferenceDto {
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CreateCategoryDto extends CreateReferenceDto {
  @IsString()
  @MaxLength(150)
  slug: string;
}

export class UpdateCategoryDto extends UpdateReferenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  slug?: string;
}
