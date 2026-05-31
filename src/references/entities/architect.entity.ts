import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Landmark } from '../../landmarks/landmark.entity.js';

@Entity('architects')
export class Architect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @OneToMany(() => Landmark, (landmark) => landmark.architect)
  landmarks: Landmark[];
}
