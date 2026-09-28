import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../dist/server/data', import.meta.url));

await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  ['products.json', 'product-images.json'].map((filename) =>
    cp(
      fileURLToPath(new URL(`../server/data/${filename}`, import.meta.url)),
      fileURLToPath(new URL(`../dist/server/data/${filename}`, import.meta.url)),
    ),
  ),
);
