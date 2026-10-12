import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
const revision = process.argv[2];
if (!/^[a-f0-9]{40}$/.test(revision ?? '')) throw new Error('Indica el SHA completo de un commit revisado de MRE-Player.');
const files = ['package.json','README.md','src/index.ts','src/index.test.ts'];
const staged = [];
for (const file of files) {
  const response = await fetch(`https://raw.githubusercontent.com/jordyfajardo-17/MRE-Player/${revision}/packages/theme-core/${file}`);
  if (!response.ok) throw new Error(`No se pudo recuperar ${file}: ${response.status}`);
  const text = await response.text(); staged.push({ file, text, sha256: createHash('sha256').update(text).digest('hex') });
}
const manifest = JSON.parse(staged.find((item) => item.file === 'package.json').text);
if (manifest.name !== '@mre/theme-core') throw new Error('El origen no contiene el paquete esperado.');
for (const { file, text } of staged) {
  const target = new URL(`../packages/theme-core/${file}`, import.meta.url);
  await mkdir(new URL('.', target), { recursive: true }); await writeFile(target, text);
}
await writeFile(new URL('../docs/theme-core-source.json', import.meta.url), JSON.stringify({ repository: 'jordyfajardo-17/MRE-Player', revision, files: Object.fromEntries(staged.map(({ file, sha256 }) => [file, sha256])) }, null, 2) + '\n');
console.log('Contrato sincronizado. Ejecuta npm ci y npm run check antes de confirmar el cambio.');
