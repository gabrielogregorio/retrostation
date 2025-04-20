import fs from 'fs';

export function saveFile(relativePath: string, data: unknown) {
  try {
    fs.writeFileSync(relativePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao salvar o JSON:', error);
  }
}
