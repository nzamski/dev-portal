import { Controller, Get } from '@nestjs/common';
import { MergeRequestsService } from './merge-requests.service';

@Controller('merge-requests')
export class MergeRequestsController {
  constructor(private readonly mergeRequestsService: MergeRequestsService) {}

  @Get()
  findOpen() {
    return this.mergeRequestsService.getOpenMergeRequests();
  }
}
