import { describe, expect, it } from 'vitest';

import type { Product } from '../types';
import { createProductId } from './productId';

const water: Product = { id: 'water', name: 'Water', priceCents: 100, quantity: 1 };

describe('createProductId', () => {
  it('slugs the product name', () => {
    expect(createProductId('Sparkling Water', [])).toBe('sparkling-water');
  });

  it('falls back to a default base for empty names', () => {
    expect(createProductId('   ', [])).toBe('product');
  });

  it('avoids collisions by appending a numeric suffix', () => {
    const products: Product[] = [
      water,
      { id: 'sparkling-water', name: 'Sparkling Water', priceCents: 100, quantity: 1 },
      {
        id: 'sparkling-water-2',
        name: 'Sparkling Water 2',
        priceCents: 100,
        quantity: 1,
      },
    ];
    expect(createProductId('Sparkling Water', products)).toBe('sparkling-water-3');
  });
});
