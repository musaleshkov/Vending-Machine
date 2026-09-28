import { formatMoney, totalCoins } from '../domain/money';
import type { Coin, Notice, Product } from '../types';

export function coinRejected(): Notice {
  return { kind: 'error', text: 'That coin is not accepted.' };
}

export function coinAdded(coin: Coin): Notice {
  return { kind: 'info', text: `${formatMoney(coin)} added.` };
}

export function productNotFound(): Notice {
  return { kind: 'error', text: 'Product not found.' };
}

export function purchaseFailed(reason: string): Notice {
  return { kind: 'error', text: reason };
}

export function purchaseSucceeded(product: Product, change: readonly Coin[]): Notice {
  return {
    kind: 'success',
    text:
      change.length > 0
        ? `${product.name} dispensed with ${formatMoney(totalCoins(change))} change.`
        : `${product.name} dispensed with exact payment.`,
  };
}

export function coinsReturned(count: number): Notice {
  return {
    kind: 'info',
    text: count > 0 ? 'Inserted coins were returned.' : 'There are no coins to return.',
  };
}

export function productAdded(name: string): Notice {
  return { kind: 'success', text: `${name} was added.` };
}

export function productUpdated(name: string): Notice {
  return { kind: 'success', text: `${name} was updated.` };
}

export function productDeleted(name: string | null): Notice {
  return name
    ? { kind: 'success', text: `${name} was deleted.` }
    : { kind: 'error', text: 'Product not found.' };
}
