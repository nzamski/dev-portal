import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('services')
export class ServiceEntity {
  @PrimaryColumn()
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
