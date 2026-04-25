import { Body, Controller, Get, Put } from '@nestjs/common';
import { BoardService } from './board.service';
import type { ReplaceBoardDto } from './dto/board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly board: BoardService) {}

  @Get()
  findAll() {
    return this.board.findAll();
  }

  @Put()
  replace(@Body() items: ReplaceBoardDto) {
    return this.board.replace(items);
  }
}
