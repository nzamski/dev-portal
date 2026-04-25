import { Body, Controller, Get, Put } from '@nestjs/common';
import { BoardService, type BoardItem } from './board.service';

@Controller('board')
export class BoardController {
  constructor(private readonly board: BoardService) {}

  @Get()
  findAll() {
    return this.board.findAll();
  }

  @Put()
  replace(@Body() items: BoardItem[]) {
    return this.board.replace(items);
  }
}
