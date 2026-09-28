import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Product } from '../types';
import { ProductCard } from './ProductCard';

const product: Product = {
  id: 'water',
  name: 'Water',
  priceCents: 100,
  quantity: 2,
};

describe('ProductCard', () => {
  it('enables Buy and dispatches the purchase when affordable', async () => {
    const onBuy = vi.fn();
    const user = userEvent.setup();
    render(<ProductCard product={product} insertedCoins={[100]} onBuy={onBuy} />);

    const button = screen.getByRole('button', { name: 'Buy Water for €1.00' });
    expect(button).toBeEnabled();
    await user.click(button);
    expect(onBuy).toHaveBeenCalledWith('water');
  });

  it('disables Buy and shows the missing amount when credit is insufficient', () => {
    render(<ProductCard product={product} insertedCoins={[50]} onBuy={() => {}} />);

    const button = screen.getByRole('button', { name: 'Buy Water for €1.00' });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Insert €0.50 more');
  });

  it('shows Unavailable when out of stock', () => {
    render(
      <ProductCard
        product={{ ...product, quantity: 0 }}
        insertedCoins={[200]}
        onBuy={() => {}}
      />,
    );

    const button = screen.getByRole('button', { name: 'Buy Water for €1.00' });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Unavailable');
  });
});
