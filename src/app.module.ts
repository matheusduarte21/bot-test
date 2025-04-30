import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CrawlerService } from './crawlers/crawler.service';
import { StorageService } from './utils/storage.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CrawlerService, StorageService],
})
export class AppModule {}
