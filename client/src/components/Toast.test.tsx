import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Notice } from '../types';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders the notice text', () => {
    const notice: Notice = { kind: 'success', text: 'Water was added.' };
    render(<Toast notice={notice} onDismiss={() => {}} />);
    expect(screen.getByText('Water was added.')).toBeInTheDocument();
  });

  it('uses an alert role for errors', () => {
    render(<Toast notice={{ kind: 'error', text: 'Boom' }} onDismiss={() => {}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('dismisses on click', async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<Toast notice={{ kind: 'info', text: 'Hi' }} onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: 'Dismiss message' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
