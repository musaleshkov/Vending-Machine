import { describe, expect, it } from 'vitest';

import { ACCEPTED_COINS } from '../types';
import { calculateChange } from './changeCalculator';

describe('calculateChange', () => {
  it('returns no coins for exact payment', () => {
    expect(calculateChange(0)).toEqual([]);
  });

  it('returns change using accepted denominations', () => {
    const change = calculateChange(280);
    expect(change).toEqual([200, 50, 20, 10]);
    expect(change?.every((coin) => ACCEPTED_COINS.includes(coin))).toBe(true);
  });

  it('rejects amounts that cannot be represented', () => {
    expect(calculateChange(5)).toBeNull();
  });

  it('finds exact change within a finite cashbox', () => {
    expect(calculateChange(60, { 10: 0, 20: 3, 50: 1, 100: 0, 200: 0 })).toEqual([
      20, 20, 20,
    ]);
  });

  it('rejects change that the cashbox cannot provide', () => {
    expect(calculateChange(70, { 10: 0, 20: 0, 50: 1, 100: 0, 200: 0 })).toBeNull();
  });

  it('rejects negative and non-integer amounts', () => {
    expect(calculateChange(-10)).toBeNull();
    expect(calculateChange(10.5)).toBeNull();
  });
});
