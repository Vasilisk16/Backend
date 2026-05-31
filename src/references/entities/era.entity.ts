import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Landmark } from '../../landmarks/landmark.entity.js';

@Entity('eras')
export class Era {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => Landmark, (landmark) => landmark.era)
  landmarks: Landmark[];
}
