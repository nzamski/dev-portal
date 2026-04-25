import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private readonly repo: Repository<Setting>,
  ) {}

  async getTitle(): Promise<string> {
    const setting = await this.repo.findOne({ where: { key: 'title' } });
    return setting?.value ?? 'Dev Portal';
  }

  async setTitle(value: string): Promise<string> {
    await this.repo.upsert({ key: 'title', value }, ['key']);
    return value;
  }
}
