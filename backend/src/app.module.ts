import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Setting } from './settings/setting.entity';
import { ServiceEntity } from './services/service.entity';
import { BoardItemEntity } from './board/board-item.entity';
import { SettingsModule } from './settings/settings.module';
import { ServicesModule } from './services/services.module';
import { BoardModule } from './board/board.module';
import { MergeRequestsModule } from './merge-requests/merge-requests.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME ?? 'devportal',
      schema: process.env.DB_SCHEMA ?? 'public',
      entities: [Setting, ServiceEntity, BoardItemEntity],
      synchronize: false,
    }),
    SettingsModule,
    ServicesModule,
    BoardModule,
    MergeRequestsModule,
  ],
})
export class AppModule {}
