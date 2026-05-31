import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Landmark } from '../../landmarks/landmark.entity.js';

@Entity('styles')
export class Style {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @OneToMany(() => Landmark, (landmark) => landmark.style)
  landmarks: Landmark[];
}
