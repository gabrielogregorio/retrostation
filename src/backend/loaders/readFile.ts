import fs from 'fs';
import path from 'path';
import { getLocalRunNode } from '@/backend/utils';

export function readFileUtil<T>(fileName: string, defaultTemplate: T): T {
  const filePath = path.join(getLocalRunNode(), fileName);

  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(fileName, JSON.stringify(defaultTemplate, null, 2));
    }

    return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
  } catch (error) {
    console.error('Erro ao ler o JSON:', error);
    return null;
  }
}
