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
import { ServicesService } from './services.service';
import type { CreateServiceDto, SyncServicesDto, UpdateServiceDto } from './dto/services.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  findAll() {
    return this.services.findAll();
  }

  @Post()
  create(@Body() body: CreateServiceDto) {
    return this.services.create(body);
  }

  @Put()
  syncAll(@Body() body: SyncServicesDto) {
    return this.services.syncAll(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateServiceDto) {
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
