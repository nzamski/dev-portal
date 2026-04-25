import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BoardItemEntity } from './board-item.entity';

export interface BoardItem {
  type: 'service';
  id: string;
}

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardItemEntity)
    private readonly repo: Repository<BoardItemEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<BoardItem[]> {
    const items = await this.repo.find({ order: { position: 'ASC' } });
    return items.map((r) => ({ type: 'service' as const, id: r.serviceId }));
  }

  async replace(items: BoardItem[]): Promise<BoardItem[]> {
    await this.dataSource.transaction(async (manager) => {
      await manager.clear(BoardItemEntity);
      for (let i = 0; i < items.length; i++) {
        await manager.save(BoardItemEntity, { serviceId: items[i].id, position: i });
      }
    });
    return items;
  }
}
