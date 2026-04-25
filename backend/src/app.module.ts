import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './settings/setting.entity';
import { ServiceEntity } from './services/service.entity';
import { BoardItemEntity } from './board/board-item.entity';
import { SettingsModule } from './settings/settings.module';
import { ServicesModule } from './services/services.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
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
  ],
})
export class AppModule {}
