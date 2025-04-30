import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { StorageService } from '../utils/storage.service';

@Injectable()
export class CrawlerService {
  constructor(private readonly storageService: StorageService) {}

  async fetchData(cpf: string): Promise<void> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const url = `https://portaldatransparencia.gov.br/servidores/consulta?ordenarPor=nome&direcao=asc`;
    await page.goto(url);
    console.log('Acessando o Portal da Transparência...');

    await page.click('#btn-cpf-1');
    console.log('Clicou para pesquisar por CPF');

    await page.waitForSelector('#cpf', { timeout: 5000 });
    await page.type('#cpf', cpf);
    console.log('Preencheu o CPF');

    await page.waitForSelector('button.btn-adicionar', { timeout: 5000 });
    await page.click('button.btn-adicionar');
    console.log('Clicou para adicionar');

    await page.waitForSelector('button[type="button"][data-original-title="consulta"]', { timeout: 5000 });
    await page.click('button[type="button"][data-original-title="consulta"]');
    console.log('Clicou para consultar');

    const historicalData = await page.evaluate(() => {
      const data: Array<{
        nome: string;
        orgao: string;
        periodo: string;
        tipoVinculo: string;
        dataInicio: string;
        dataTermino: string;
        localExercicio: string;
        orgaoOrigem: string;
        cargo: string;
      }> = [];

      const table: any = document.querySelector('#tabela-historico-poder-executivo');
      if (!table) return data;

      const rows = table.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        const entry = {
          nome: 'Desconhecido', 
          orgao: 'Desconhecido', 
          periodo: `${columns[1]?.innerText.trim()} até ${columns[2]?.innerText.trim()}`,
          tipoVinculo: columns[0]?.innerText.trim(),
          dataInicio: columns[1]?.innerText.trim(),
          dataTermino: columns[2]?.innerText.trim(),
          localExercicio: columns[3]?.innerText.trim(),
          orgaoOrigem: columns[4]?.innerText.trim(),
          cargo: columns[5]?.innerText.trim(),
        };
        data.push(entry);
      });

      return data;
    });

    await browser.close();
    await this.storageService.saveData(historicalData);
  }
}
