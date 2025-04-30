import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface HistoricoEntry {
  nome: string;
  orgao: string;
  periodo: string;
}


@Injectable()
export class StorageService {
  async saveData(data: HistoricoEntry[]): Promise<void> {
    const filePath = path.join(__dirname, '../../data/data.json');

    let existingData = [];
    if (fs.existsSync(filePath)) {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const allData = [...existingData, ...data];
    fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));
    console.log('Dados salvos com sucesso!');
  }
}
