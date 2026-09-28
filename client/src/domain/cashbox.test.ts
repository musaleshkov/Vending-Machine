import { describe, expect, it } from 'vitest';

import { addCoins, cashboxTotal, removeCoins } from './cashbox';

const cashbox = { 10: 1, 20: 2, 50: 3, 100: 4, 200: 5 } as const;

describe('cashbox', () => {
  it('adds inserted coins without mutating the original cashbox', () => {
    const next = addCoins(cashbox, [20, 100]);
    expect(next[20]).toBe(3);
    expect(next[100]).toBe(5);
    expect(cashbox[20]).toBe(2);
  });

  it('removes dispensed coins', () => {
    expect(removeCoins(cashbox, [50, 50, 200])).toMatchObject({
      50: 1,
      200: 4,
    });
  });

  it('refuses to remove an unavailable coin', () => {
    expect(removeCoins(cashbox, [10, 10])).toBeNull();
  });

  it('calculates the total reserve value', () => {
    expect(cashboxTotal(cashbox)).toBe(1600);
  });
});
