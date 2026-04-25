import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { MergeRequestsController } from './merge-requests.controller';
import { MergeRequestsService } from './merge-requests.service';

@Module({
  imports: [SettingsModule],
  controllers: [MergeRequestsController],
  providers: [MergeRequestsService],
})
export class MergeRequestsModule {}
