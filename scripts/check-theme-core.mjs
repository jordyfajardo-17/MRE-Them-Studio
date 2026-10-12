import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const source = JSON.parse(await readFile(new URL('../docs/theme-core-source.json', import.meta.url), 'utf8'));
if (!/^[a-f0-9]{40}$/.test(source.revision)) throw new Error('Falta un commit de origen válido.');
for (const [file, expected] of Object.entries(source.files)) {
  const data = await readFile(new URL(`../packages/theme-core/${file}`, import.meta.url));
  if (createHash('sha256').update(data).digest('hex') !== expected) throw new Error(`Contrato modificado sin sincronizar: ${file}`);
}
console.log(`Contrato coincide con el snapshot de Player ${source.revision.slice(0, 7)}.`);
