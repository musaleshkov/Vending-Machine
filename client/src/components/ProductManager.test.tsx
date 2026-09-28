import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Product } from '../types';
import { ProductManager } from './ProductManager';

const products: Product[] = [
  { id: 'water', name: 'Water', priceCents: 100, quantity: 2 },
  { id: 'tea', name: 'Tea', priceCents: 140, quantity: 3 },
];

const cashbox = { 10: 1, 20: 1, 50: 1, 100: 1, 200: 1 };

function renderManager(overrides: Partial<Parameters<typeof ProductManager>[0]> = {}) {
  const props = {
    products,
    cashbox,
    onAdd: vi.fn(),
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  };
  render(<ProductManager {...props} />);
  return props;
}

describe('ProductManager', () => {
  it('deletes a product when confirmed', async () => {
    const user = userEvent.setup();
    const props = renderManager({ onConfirmDelete: () => true });

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!);

    expect(props.onDelete).toHaveBeenCalledWith('water');
  });

  it('keeps a product when deletion is declined', async () => {
    const user = userEvent.setup();
    const props = renderManager({ onConfirmDelete: () => false });

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[1]!);

    expect(props.onDelete).not.toHaveBeenCalled();
  });

  it('updates a product through the edit form', async () => {
    const user = userEvent.setup();
    const props = renderManager();

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]!);
    const nameInput = screen.getByLabelText('Product name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Sparkling Water');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(props.onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'water', name: 'Sparkling Water' }),
    );
  });
});
