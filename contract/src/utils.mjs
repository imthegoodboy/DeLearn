import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export function getScByteCode(folderName, fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(path.dirname(__filename));
  return readFileSync(path.join(__dirname, folderName, fileName));
}

