import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchProductImages } from './productImagesApi';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchProductImages', () => {
  it('returns the server image catalog', async () => {
    const catalog = [
      { id: 'water', label: 'Water', url: '/products/sparkling-water.png' },
    ];
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(catalog));

    await expect(fetchProductImages()).resolves.toEqual(catalog);
  });

  it('rejects invalid image catalog entries', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse([{ id: 'water', label: 'Water' }]),
    );

    await expect(fetchProductImages()).rejects.toThrow('invalid response');
  });
});
