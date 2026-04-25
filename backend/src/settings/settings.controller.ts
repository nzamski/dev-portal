import { Body, Controller, Get, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  async get() {
    return { title: await this.settings.getTitle() };
  }

  @Put('title')
  async setTitle(@Body() body: { value: string }) {
    return { title: await this.settings.setTitle(body.value) };
  }
}
