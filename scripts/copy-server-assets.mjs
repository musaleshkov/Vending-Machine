import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../server/data/products.json', import.meta.url));
const outputDirectory = fileURLToPath(new URL('../dist/server/data', import.meta.url));
const output = fileURLToPath(
  new URL('../dist/server/data/products.json', import.meta.url),
);

await mkdir(outputDirectory, { recursive: true });
await cp(source, output);
