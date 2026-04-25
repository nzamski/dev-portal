import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: '' })
  description!: string;

  @Column({ name: 'icon_name', default: '' })
  iconName!: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  links!: { label: string; url: string }[];
}
