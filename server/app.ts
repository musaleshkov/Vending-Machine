import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import cors from 'cors';
import express from 'express';

export function createApp() {
  const app = express();
  const productsPath = fileURLToPath(new URL('./data/products.json', import.meta.url));
  const clientPath = fileURLToPath(new URL('../client', import.meta.url));

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.get('/api/products', async (_request, response, next) => {
    try {
      const source = await readFile(productsPath, 'utf8');
      response.json(JSON.parse(source));
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
      next: express.NextFunction,
    ) => {
      void next;
      console.error(error);
      response.status(500).json({ message: 'Unable to load products.' });
    },
  );

  return app;
}
