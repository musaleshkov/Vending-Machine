import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { PurchaseResultNotice } from '../types';
import { PurchaseDialog } from './PurchaseDialog';

describe('PurchaseDialog', () => {
  it('shows a success result with returned change', () => {
    const result: PurchaseResultNotice = {
      kind: 'success',
      productName: 'Water',
      change: [50, 20],
    };
    render(<PurchaseDialog result={result} onClose={() => {}} />);

    expect(
      screen.getByRole('heading', { name: 'Enjoy your product!' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Water dispensed with/)).toBeInTheDocument();
  });

  it('shows an error result', () => {
    const result: PurchaseResultNotice = {
      kind: 'error',
      message: 'Insert more money.',
    };
    render(<PurchaseDialog result={result} onClose={() => {}} />);

    expect(
      screen.getByRole('heading', { name: 'Cannot complete purchase' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Insert more money.')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const result: PurchaseResultNotice = {
      kind: 'success',
      productName: 'Water',
      change: [],
    };
    render(<PurchaseDialog result={result} onClose={onClose} />);

    await user.click(screen.getAllByRole('button', { name: 'Close' })[0]!);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const result: PurchaseResultNotice = {
      kind: 'success',
      productName: 'Water',
      change: [],
    };
    render(<PurchaseDialog result={result} onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
