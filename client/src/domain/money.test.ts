import { describe, expect, it } from 'vitest';

import {
  centsToEuros,
  formatMoney,
  isAcceptedCoin,
  MINIMUM_COIN,
  parsePriceToCents,
  totalCoins,
} from './money';

describe('isAcceptedCoin', () => {
  it('accepts the five supported denominations', () => {
    expect([10, 20, 50, 100, 200].every(isAcceptedCoin)).toBe(true);
  });

  it('rejects unsupported values', () => {
    expect(isAcceptedCoin(5)).toBe(false);
    expect(isAcceptedCoin(25)).toBe(false);
    expect(isAcceptedCoin(500)).toBe(false);
  });
});

describe('totalCoins', () => {
  it('sums inserted coins', () => {
    expect(totalCoins([100, 20, 10])).toBe(130);
  });

  it('returns zero for an empty list', () => {
    expect(totalCoins([])).toBe(0);
  });
});

describe('formatMoney', () => {
  it('formats cents as euros', () => {
    expect(formatMoney(130)).toBe('€1.30');
    expect(formatMoney(1000)).toBe('€10.00');
  });
});

describe('parsePriceToCents', () => {
  it('parses decimal euro strings without floating-point drift', () => {
    expect(parsePriceToCents('1.10')).toBe(110);
    expect(parsePriceToCents('1.15')).toBe(115);
    expect(parsePriceToCents('0.10')).toBe(10);
    expect(parsePriceToCents('2')).toBe(200);
  });

  it('accepts comma decimals and leading whitespace', () => {
    expect(parsePriceToCents(' 1,20 ')).toBe(120);
  });

  it('returns zero for empty or invalid input', () => {
    expect(parsePriceToCents('')).toBe(0);
    expect(parsePriceToCents('abc')).toBe(0);
  });

  it('rejects multiple decimal points and non-numeric fractions', () => {
    expect(parsePriceToCents('1.5.5')).toBe(0);
    expect(parsePriceToCents('1.abc')).toBe(0);
    expect(parsePriceToCents('1.109')).toBe(0);
  });
});

describe('MINIMUM_COIN', () => {
  it('is ten cents', () => {
    expect(MINIMUM_COIN).toBe(10);
  });
});

describe('centsToEuros', () => {
  it('formats cents as a plain euro string without a symbol', () => {
    expect(centsToEuros(130)).toBe('1.30');
    expect(centsToEuros(100)).toBe('1.00');
    expect(centsToEuros(10)).toBe('0.10');
    expect(centsToEuros(5)).toBe('0.05');
  });
});
