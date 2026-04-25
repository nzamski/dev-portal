import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardItemEntity } from './board-item.entity';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoardItemEntity])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
