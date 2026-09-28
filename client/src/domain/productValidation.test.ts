import { describe, expect, it } from 'vitest';

import { isProduct, validateProduct } from './productValidation';

describe('validateProduct', () => {
  it('accepts a complete product draft', () => {
    expect(validateProduct({ name: 'Water', priceCents: 100, quantity: 15 }).valid).toBe(
      true,
    );
  });

  it('requires a name', () => {
    expect(
      validateProduct({ name: ' ', priceCents: 100, quantity: 1 }).errors.name,
    ).toBeTruthy();
  });

  it('requires prices in 10-cent increments', () => {
    expect(
      validateProduct({ name: 'Water', priceCents: 105, quantity: 1 }).errors.priceCents,
    ).toBeTruthy();
  });

  it('requires whole-number quantities between 0 and 15', () => {
    expect(
      validateProduct({ name: 'Water', priceCents: 100, quantity: 16 }).errors.quantity,
    ).toBeTruthy();
    expect(
      validateProduct({ name: 'Water', priceCents: 100, quantity: 1.5 }).errors.quantity,
    ).toBeTruthy();
  });
});

describe('isProduct', () => {
  it('accepts a valid product', () => {
    expect(isProduct({ id: 'water', name: 'Water', priceCents: 100, quantity: 5 })).toBe(
      true,
    );
  });

  it('rejects non-object values', () => {
    expect(isProduct(null)).toBe(false);
    expect(isProduct('water')).toBe(false);
    expect(isProduct(undefined)).toBe(false);
  });

  it('rejects invalid ids, prices, and quantities', () => {
    expect(isProduct({ id: '', name: 'Water', priceCents: 100, quantity: 5 })).toBe(
      false,
    );
    expect(isProduct({ id: 'water', name: 'Water', priceCents: 105, quantity: 5 })).toBe(
      false,
    );
    expect(isProduct({ id: 'water', name: 'Water', priceCents: 100, quantity: 16 })).toBe(
      false,
    );
  });
});
