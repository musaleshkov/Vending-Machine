import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import cors from 'cors';
import express from 'express';

async function readJson(path: string, message: string): Promise<unknown> {
  try {
    const source = await readFile(path, 'utf8');
    return JSON.parse(source);
  } catch (error) {
    throw new Error(message, { cause: error });
  }
}

export function createApp() {
  const app = express();
  const productsPath = fileURLToPath(new URL('./data/products.json', import.meta.url));
  const productImagesPath = fileURLToPath(
    new URL('./data/product-images.json', import.meta.url),
  );
  const clientPath = fileURLToPath(new URL('../client', import.meta.url));

  app.use(cors());

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.get('/api/products', async (_request, response, next) => {
    try {
      response.json(await readJson(productsPath, 'Unable to load products.'));
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/product-images', async (_request, response, next) => {
    try {
      response.json(await readJson(productImagesPath, 'Unable to load product images.'));
    } catch (error) {
      next(error);
    }
  });

  if (existsSync(join(clientPath, 'index.html'))) {
    app.use(express.static(clientPath));
    app.use((request, response, next) => {
      if (request.method === 'GET' && request.accepts('html')) {
        response.sendFile(join(clientPath, 'index.html'));
        return;
      }
      next();
    });
  }

  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Internal server error.';
      response.status(500).json({ message });
    },
  );

  return app;
}
