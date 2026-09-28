import { ACCEPTED_COINS, type Cashbox, type Coin } from './coins';

const DESCENDING_COINS = [...ACCEPTED_COINS].sort((a, b) => b - a);

export function calculateChange(
  amountCents: number,
  cashbox?: Readonly<Cashbox>,
): Coin[] | null {
  if (!Number.isInteger(amountCents) || amountCents < 0) {
    return null;
  }

  function findChange(index: number, remaining: number): Coin[] | null {
    if (remaining === 0) {
      return [];
    }
    if (index >= DESCENDING_COINS.length) {
      return null;
    }

    const coin = DESCENDING_COINS[index]!;
    const available = cashbox ? cashbox[coin] : Math.floor(remaining / coin);
    const maximum = Math.min(Math.floor(remaining / coin), available);

    for (let count = maximum; count >= 0; count -= 1) {
      const rest = findChange(index + 1, remaining - count * coin);
      if (rest !== null) {
        return [...Array<Coin>(count).fill(coin), ...rest];
      }
    }

    return null;
  }

  return findChange(0, amountCents);
}
