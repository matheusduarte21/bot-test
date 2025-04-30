import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawlers/crawler.service';

@Controller()
export class AppController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get('start-crawler')
  async startCrawler(@Query('cpf') cpf: string): Promise<string> {
    if (!cpf) {
      return 'Por favor, forneça o CPF via query param `cpf`';
    }

    await this.crawlerService.fetchData(cpf);
    return 'Crawler executado com sucesso! Dados armazenados.';
  }
}
