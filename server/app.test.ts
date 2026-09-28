import { readFile } from 'node:fs/promises';

import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApp } from './app';

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  return { ...actual, readFile: vi.fn(actual.readFile) };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mock API', () => {
  it('reports health', async () => {
    const app = createApp();
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('serves the product list', async () => {
    const app = createApp();
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('serves the product image catalog', async () => {
    const app = createApp();
    const response = await request(app).get('/api/product-images');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: '/products/sparkling-water.png' }),
      ]),
    );
  });

  it('serves the client application for html requests', async () => {
    const app = createApp();
    const response = await request(app).get('/').set('Accept', 'text/html');
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
  });

  it('returns a 500 when the product source cannot be read', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(readFile).mockRejectedValueOnce(new Error('boom'));
    const app = createApp();
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Unable to load products.' });
  });
});
