import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './App';

const products = [
  { id: 'water', name: 'Water', priceCents: 100, quantity: 2 },
  { id: 'tea', name: 'Tea', priceCents: 140, quantity: 0 },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('loads products and completes a purchase', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(products), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Water' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Insert €1.00' }));
    await user.click(screen.getByRole('button', { name: 'Buy Water for €1.00' }));

    expect(screen.getByText('Water dispensed with exact payment.')).toBeInTheDocument();
    expect(screen.getByText('1 available')).toBeInTheDocument();
  });

  it('adds a product in local state', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(products), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('heading', { name: 'Water' });

    await user.click(screen.getByRole('button', { name: 'Manage inventory' }));
    await user.clear(screen.getByLabelText('Product name'));
    await user.type(screen.getByLabelText('Product name'), 'Crackers');
    await user.click(screen.getByRole('button', { name: 'Add product' }));

    expect(screen.getByRole('heading', { name: 'Crackers' })).toBeInTheDocument();
  });

  it('shows a recoverable API error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));
    render(<App />);

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Products are temporarily unavailable',
      ),
    );
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
