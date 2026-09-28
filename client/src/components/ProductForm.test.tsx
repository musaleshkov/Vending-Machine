import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductForm } from './ProductForm';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ProductForm', () => {
  it('shows validation errors and skips onSave for invalid input', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Add product' }));

    expect(await screen.findByText('Enter a product name.')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves a valid product with the entered values', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm onSave={onSave} />);

    await user.type(screen.getByLabelText('Product name'), 'Crackers');
    await user.click(screen.getByRole('button', { name: 'Add product' }));

    expect(onSave).toHaveBeenCalledWith(
      { name: 'Crackers', priceCents: 100, quantity: 1, category: 'snacks' },
      undefined,
    );
  });

  it('selects a category', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm onSave={onSave} />);

    await user.type(screen.getByLabelText('Product name'), 'Soda');
    await user.selectOptions(screen.getByLabelText('Category'), 'drinks');
    await user.click(screen.getByRole('button', { name: 'Add product' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Soda', category: 'drinks' }),
      undefined,
    );
  });

  it('parses a decimal price and quantity', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm onSave={onSave} />);

    await user.type(screen.getByLabelText('Product name'), 'Juice');
    fireEvent.change(screen.getByLabelText('Price in EUR'), {
      target: { value: '1.50' },
    });
    fireEvent.change(screen.getByLabelText('Quantity'), {
      target: { value: '3' },
    });
    await user.click(screen.getByRole('button', { name: 'Add product' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Juice', priceCents: 150, quantity: 3 }),
      undefined,
    );
  });

  it('renders server images and selects one', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify([{ id: 'water', label: 'Water', url: '/products/water.png' }]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm onSave={onSave} />);

    await user.click(await screen.findByRole('button', { name: 'Water' }));
    await user.type(screen.getByLabelText('Product name'), 'Water');
    await user.click(screen.getByRole('button', { name: 'Add product' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Water', image: '/products/water.png' }),
      undefined,
    );
  });
});
