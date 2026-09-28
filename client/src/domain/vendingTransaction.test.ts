import { describe, expect, it } from 'vitest';

import type { Cashbox, Product } from '../types';
import { processPurchase } from './vendingTransaction';

const product: Product = {
  id: 'water',
  name: 'Water',
  priceCents: 130,
  quantity: 3,
};

const cashbox: Cashbox = { 10: 2, 20: 2, 50: 2, 100: 2, 200: 2 };

describe('processPurchase', () => {
  it('rejects an out-of-stock product', () => {
    expect(processPurchase({ ...product, quantity: 0 }, [200], cashbox)).toMatchObject({
      success: false,
      reason: 'Water is out of stock.',
    });
  });

  it('rejects insufficient credit', () => {
    expect(processPurchase(product, [100, 20], cashbox)).toMatchObject({
      success: false,
      reason: 'Insert more money to buy this product.',
    });
  });

  it('allows exact payment', () => {
    const result = processPurchase(product, [100, 20, 10], cashbox);
    expect(result).toMatchObject({ success: true, change: [] });
  });

  it('returns the remaining balance as change', () => {
    const result = processPurchase(product, [200], cashbox);
    expect(result).toMatchObject({ success: true, change: [50, 20] });
  });

  it('adds inserted coins and removes dispensed change from the cashbox', () => {
    const result = processPurchase(product, [200], cashbox);
    if (!result.success) {
      throw new Error('expected a successful purchase');
    }
    expect(result.cashbox[200]).toBe(cashbox[200] + 1);
    expect(result.cashbox[50]).toBe(cashbox[50] - 1);
    expect(result.cashbox[20]).toBe(cashbox[20] - 1);
  });

  it('rejects a purchase when the cashbox cannot return exact change', () => {
    const result = processPurchase(product, [200], {
      10: 0,
      20: 0,
      50: 1,
      100: 0,
      200: 1,
    });
    expect(result).toMatchObject({
      success: false,
      reason: 'The machine cannot return exact change.',
    });
  });
});
