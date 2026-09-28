import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from './Icon';

describe('Icon', () => {
  it('renders a hidden svg at the default size', () => {
    const { container } = render(<Icon name="cart" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '20');
  });

  it('applies a custom size', () => {
    const { container } = render(<Icon name="cart" size={30} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '30');
  });
});
