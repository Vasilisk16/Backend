import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Landmark } from '../../landmarks/landmark.entity.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  slug: string;

  @ManyToMany(() => Landmark, (landmark) => landmark.categories)
  @JoinTable({
    name: 'landmark_categories',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'landmark_id', referencedColumnName: 'id' },
  })
  landmarks: Landmark[];
}
