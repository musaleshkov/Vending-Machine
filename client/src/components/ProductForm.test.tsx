import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ProductForm } from './ProductForm';

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
      { name: 'Crackers', priceCents: 100, quantity: 1 },
      undefined,
    );
  });
});
