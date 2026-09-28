import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Product } from '../types';
import { fetchProducts } from './productsApi';

const product: Product = { id: 'water', name: 'Water', priceCents: 100, quantity: 1 };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchProducts', () => {
  it('returns validated products', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([product]));
    await expect(fetchProducts()).resolves.toEqual([product]);
  });

  it('throws when the request is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));
    await expect(fetchProducts()).rejects.toThrow(
      'The product list could not be loaded.',
    );
  });

  it('throws when the payload is not an array', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ products: [product] }),
    );
    await expect(fetchProducts()).rejects.toThrow('invalid response');
  });

  it('throws when a product is invalid', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse([{ ...product, priceCents: 105 }]),
    );
    await expect(fetchProducts()).rejects.toThrow('invalid product data');
  });
});
