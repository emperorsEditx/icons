// src/categories/entities/category.entity.ts
import { Bundle } from 'src/bundles/entities/bundle.entity';
import { Icon } from 'src/icons/entities/icon.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 191 })
  name: string;

  @Column({ type: 'enum', enum: CategoryStatus, default: CategoryStatus.ACTIVE })
  status: CategoryStatus;

  @OneToMany(() => Icon, (icon) => icon.category)
  icons: Icon[];

  @OneToMany(() => Bundle, (bundle) => bundle.category)
  bundles: Bundle[];
}
