import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './service.entity';
import type { ServiceContract } from '../contracts/domain.types';

export type Service = ServiceContract;

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly repo: Repository<ServiceEntity>,
  ) {}

  findAll(): Promise<ServiceEntity[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  create(service: Omit<ServiceContract, 'id'>): Promise<ServiceEntity> {
    return this.repo.save(this.repo.create(service));
  }

  async update(id: string, data: Omit<ServiceContract, 'id'>): Promise<ServiceEntity | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;
    return this.repo.save({ ...existing, ...data });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async syncAll(incoming: ServiceContract[]): Promise<ServiceEntity[]> {
    const current = await this.repo.find();
    const incomingIds = new Set(incoming.map((s) => s.id));
    const toDelete = current.filter((c) => !incomingIds.has(c.id));
    if (toDelete.length > 0) {
      await this.repo.delete(toDelete.map((s) => s.id));
    }
    if (incoming.length === 0) return [];
    return this.repo.save(incoming);
  }
}
