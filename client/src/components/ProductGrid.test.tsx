import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Product } from '../types';
import { ProductGrid } from './ProductGrid';

const products: Product[] = [
  { id: 'water', name: 'Water', priceCents: 100, quantity: 2 },
];

describe('ProductGrid', () => {
  it('renders products', () => {
    render(<ProductGrid products={products} insertedCoins={[]} onBuy={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Water' })).toBeInTheDocument();
  });

  it('shows an empty state when there are no products', () => {
    render(<ProductGrid products={[]} insertedCoins={[]} onBuy={() => {}} />);
    expect(screen.getByText('No products available')).toBeInTheDocument();
  });
});
