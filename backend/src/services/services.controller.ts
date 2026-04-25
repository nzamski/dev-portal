import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ServicesService, type Service } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  findAll() {
    return this.services.findAll();
  }

  @Post()
  create(@Body() body: Omit<Service, 'id'>) {
    return this.services.create(body);
  }

  @Put()
  syncAll(@Body() body: Service[]) {
    return this.services.syncAll(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Omit<Service, 'id'>) {
    const result = await this.services.update(id, body);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.services.remove(id);
  }
}
