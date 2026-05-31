import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Landmark } from '../../landmarks/landmark.entity.js';

@Entity('purposes')
export class Purpose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @OneToMany(() => Landmark, (landmark) => landmark.purpose)
  landmarks: Landmark[];
}
