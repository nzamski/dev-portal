import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('board_items')
export class BoardItemEntity {
  @PrimaryColumn({ name: 'service_id' })
  serviceId!: string;

  @Column({ type: 'smallint' })
  position!: number;
}
