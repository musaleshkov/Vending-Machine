import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('calls onManage when Manage inventory is clicked', async () => {
    const onManage = vi.fn();
    const user = userEvent.setup();
    render(<SiteHeader onManage={onManage} />);

    await user.click(screen.getByRole('button', { name: 'Manage inventory' }));
    expect(onManage).toHaveBeenCalled();
  });
});
