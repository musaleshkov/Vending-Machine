import { describe, expect, it } from 'vitest';

import { inferCategory } from './productCategory';

describe('inferCategory', () => {
  it('returns the explicit category when present', () => {
    expect(inferCategory({ name: 'Soda', category: 'drinks' })).toBe('drinks');
  });

  it('infers drinks from name keywords', () => {
    expect(inferCategory({ name: 'Sparkling Water' })).toBe('drinks');
    expect(inferCategory({ name: 'Orange Juice' })).toBe('drinks');
    expect(inferCategory({ name: 'Iced Tea' })).toBe('drinks');
  });

  it('infers sweets from chocolate', () => {
    expect(inferCategory({ name: 'Chocolate Bar' })).toBe('sweets');
  });

  it('defaults to snacks', () => {
    expect(inferCategory({ name: 'Trail Mix' })).toBe('snacks');
  });
});
