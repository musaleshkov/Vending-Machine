import { ACCEPTED_COINS, type Cashbox, type Coin } from './coins';

export const INITIAL_CASHBOX: Cashbox = {
  10: 12,
  20: 10,
  50: 8,
  100: 6,
  200: 4,
};

export function addCoins(cashbox: Readonly<Cashbox>, coins: readonly Coin[]): Cashbox {
  const next = { ...cashbox };
  for (const coin of coins) {
    next[coin] += 1;
  }
  return next;
}

export function removeCoins(
  cashbox: Readonly<Cashbox>,
  coins: readonly Coin[],
): Cashbox | null {
  const next = { ...cashbox };
  for (const coin of coins) {
    if (next[coin] <= 0) {
      return null;
    }
    next[coin] -= 1;
  }
  return next;
}

export function cashboxTotal(cashbox: Readonly<Cashbox>): number {
  return ACCEPTED_COINS.reduce((total, coin) => total + coin * cashbox[coin], 0);
}
