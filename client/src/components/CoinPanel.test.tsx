import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CoinPanel } from './CoinPanel';

describe('CoinPanel', () => {
  it('inserts a coin and resets the transaction', async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();
    const onReset = vi.fn();
    render(
      <CoinPanel
        insertedCoins={[100]}
        returnedCoins={[]}
        onInsert={onInsert}
        onReset={onReset}
      />,
    );

    expect(screen.getByText('€1.00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Insert €0.50' }));
    expect(onInsert).toHaveBeenCalledWith(50);

    await user.click(screen.getByRole('button', { name: 'Return coins' }));
    expect(onReset).toHaveBeenCalled();
  });

  it('shows the change tray when coins are returned', () => {
    render(
      <CoinPanel
        insertedCoins={[]}
        returnedCoins={[50, 20]}
        onInsert={() => {}}
        onReset={() => {}}
      />,
    );

    expect(screen.getByText('Change tray')).toBeInTheDocument();
    expect(screen.getByText('€0.70')).toBeInTheDocument();
  });
});
