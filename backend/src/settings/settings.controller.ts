import { Body, Controller, Get, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import type { SetTitleDto, UpdateGitLabConfigDto } from './dto/settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  async get() {
    return { title: await this.settings.getTitle() };
  }

  @Put('title')
  async setTitle(@Body() body: SetTitleDto) {
    return { title: await this.settings.setTitle(body.value) };
  }

  @Get('gitlab')
  async getGitLab() {
    return this.settings.getGitLabConfig();
  }

  @Put('gitlab')
  async setGitLab(@Body() body: UpdateGitLabConfigDto) {
    return this.settings.setGitLabConfig(body);
  }
}
