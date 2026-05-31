import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Architect } from '../references/entities/architect.entity.js';
import { Category } from '../references/entities/category.entity.js';
import { Era } from '../references/entities/era.entity.js';
import { LegalStatus } from '../references/entities/legal-status.entity.js';
import { Purpose } from '../references/entities/purpose.entity.js';
import { Style } from '../references/entities/style.entity.js';

@Entity('landmarks')
export class Landmark {
  @PrimaryColumn({ length: 150 })
  slug: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  subtitle: string;

  @Column({ name: 'short_description', type: 'text' })
  shortDescription: string;

  @Column({ name: 'full_description', type: 'text' })
  fullDescription: string;

  @Column({ name: 'year_of_construction', length: 50 })
  yearOfConstruction: string;

  @Column({ length: 255 })
  address: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'era_id' })
  eraId: number;

  @ManyToOne(() => Era, (era) => era.landmarks, { eager: false })
  @JoinColumn({ name: 'era_id' })
  era: Era;

  @Column({ name: 'style_id' })
  styleId: number;

  @ManyToOne(() => Style, (style) => style.landmarks, { eager: false })
  @JoinColumn({ name: 'style_id' })
  style: Style;

  @Column({ name: 'architect_id', nullable: true })
  architectId: number | null;

  @ManyToOne(() => Architect, (architect) => architect.landmarks, {
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'architect_id' })
  architect: Architect | null;

  @Column({ name: 'purpose_id' })
  purposeId: number;

  @ManyToOne(() => Purpose, (purpose) => purpose.landmarks, { eager: false })
  @JoinColumn({ name: 'purpose_id' })
  purpose: Purpose;

  @Column({ name: 'legal_status_id' })
  legalStatusId: number;

  @ManyToOne(() => LegalStatus, (legalStatus) => legalStatus.landmarks, {
    eager: false,
  })
  @JoinColumn({ name: 'legal_status_id' })
  legalStatus: LegalStatus;

  @ManyToMany(() => Category, (category) => category.landmarks, {
    eager: false,
  })
  categories: Category[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
