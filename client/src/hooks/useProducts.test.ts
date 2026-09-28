import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { VendingAction } from '../state/vendingReducer';
import type { Product } from '../types';
import { useProducts } from './useProducts';

const products: Product[] = [
  { id: 'water', name: 'Water', priceCents: 100, quantity: 1 },
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useProducts', () => {
  it('loads products and reports success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(products));
    const dispatch = vi.fn<(action: VendingAction) => void>();
    renderHook(() => useProducts(dispatch));

    expect(dispatch).toHaveBeenCalledWith({ type: 'productsLoadStarted' });
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: 'productsLoadSucceeded', products }),
    );
  });

  it('reports a failure on error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));
    const dispatch = vi.fn<(action: VendingAction) => void>();
    renderHook(() => useProducts(dispatch));

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: 'productsLoadFailed',
        error: 'The product list could not be loaded.',
      }),
    );
  });

  it('ignores aborted requests', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new DOMException('Aborted', 'AbortError'),
    );
    const dispatch = vi.fn<(action: VendingAction) => void>();
    renderHook(() => useProducts(dispatch));

    expect(dispatch).toHaveBeenCalledWith({ type: 'productsLoadStarted' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'productsLoadFailed' }),
    );
  });
});
