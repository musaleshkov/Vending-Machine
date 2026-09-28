import { describe, expect, it } from 'vitest';

import type { Product } from '../types';
import { initialVendingState, vendingReducer, type VendingState } from './vendingReducer';

const water: Product = { id: 'water', name: 'Water', priceCents: 100, quantity: 2 };

function readyState(overrides: Partial<VendingState> = {}): VendingState {
  return { ...initialVendingState, loading: false, products: [water], ...overrides };
}

describe('vendingReducer', () => {
  it('loads products', () => {
    const state = vendingReducer(initialVendingState, {
      type: 'productsLoadSucceeded',
      products: [water],
    });
    expect(state.products).toEqual([water]);
    expect(state.loading).toBe(false);
  });

  it('rejects an invalid coin without adding credit', () => {
    const state = vendingReducer(readyState(), { type: 'coinInserted', coin: 25 });
    expect(state.insertedCoins).toEqual([]);
    expect(state.notice?.kind).toBe('error');
  });

  it('keeps stock and credit unchanged after a failed purchase', () => {
    const before = readyState({ insertedCoins: [50] });
    const state = vendingReducer(before, {
      type: 'purchaseRequested',
      productId: 'water',
    });
    expect(state.products).toEqual(before.products);
    expect(state.insertedCoins).toEqual([50]);
    expect(state.purchaseResult).toEqual({
      kind: 'error',
      message: 'Insert more money to buy this product.',
    });
  });

  it('decrements stock and clears credit after a successful purchase', () => {
    const state = vendingReducer(readyState({ insertedCoins: [200] }), {
      type: 'purchaseRequested',
      productId: 'water',
    });
    expect(state.products[0]!.quantity).toBe(1);
    expect(state.insertedCoins).toEqual([]);
    expect(state.returnedCoins).toEqual([100]);
    expect(state.cashbox[200]).toBe(initialVendingState.cashbox[200] + 1);
    expect(state.cashbox[100]).toBe(initialVendingState.cashbox[100] - 1);
  });

  it('preserves credit and stock when exact change is unavailable', () => {
    const state = vendingReducer(
      readyState({
        insertedCoins: [200],
        products: [{ ...water, priceCents: 130 }],
        cashbox: { 10: 0, 20: 0, 50: 0, 100: 0, 200: 0 },
      }),
      { type: 'purchaseRequested', productId: 'water' },
    );
    expect(state.products[0]!.quantity).toBe(2);
    expect(state.insertedCoins).toEqual([200]);
    expect(state.notice).toBeNull();
    expect(state.purchaseResult).toEqual({
      kind: 'error',
      message: 'The machine cannot return exact change.',
    });
  });

  it('returns the inserted coins without changing products', () => {
    const before = readyState({ insertedCoins: [100, 20] });
    const state = vendingReducer(before, { type: 'transactionReset' });
    expect(state.products).toEqual(before.products);
    expect(state.insertedCoins).toEqual([]);
    expect(state.returnedCoins).toEqual([100, 20]);
  });

  it('supports local product CRUD', () => {
    const snack: Product = { id: 'snack', name: 'Snack', priceCents: 150, quantity: 4 };
    const added = vendingReducer(readyState(), { type: 'productAdded', product: snack });
    const updated = vendingReducer(added, {
      type: 'productUpdated',
      product: { ...snack, quantity: 5 },
    });
    const deleted = vendingReducer(updated, {
      type: 'productDeleted',
      productId: 'snack',
    });
    expect(added.products).toHaveLength(2);
    expect(updated.products.find(({ id }) => id === 'snack')?.quantity).toBe(5);
    expect(deleted.products).toEqual([water]);
  });

  it('removes an inserted coin by index', () => {
    const state = vendingReducer(readyState({ insertedCoins: [100, 20] }), {
      type: 'insertedCoinRemoved',
      index: 0,
    });
    expect(state.insertedCoins).toEqual([20]);
  });

  it('tracks loading start and failure', () => {
    const started = vendingReducer(readyState(), { type: 'productsLoadStarted' });
    expect(started.loading).toBe(true);
    expect(started.loadError).toBeNull();

    const failed = vendingReducer(started, {
      type: 'productsLoadFailed',
      error: 'boom',
    });
    expect(failed.loading).toBe(false);
    expect(failed.loadError).toBe('boom');
  });

  it('dismisses messages and purchase results', () => {
    const withNotice = vendingReducer(readyState(), { type: 'coinInserted', coin: 100 });
    expect(withNotice.notice).toBeTruthy();
    expect(vendingReducer(withNotice, { type: 'messageDismissed' }).notice).toBeNull();

    const purchased = vendingReducer(readyState({ insertedCoins: [100] }), {
      type: 'purchaseRequested',
      productId: 'water',
    });
    expect(purchased.purchaseResult).toBeTruthy();
    expect(
      vendingReducer(purchased, { type: 'purchaseResultDismissed' }).purchaseResult,
    ).toBeNull();
  });
});
