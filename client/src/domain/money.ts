import { ACCEPTED_COINS, type Coin } from './coins';

export const MINIMUM_COIN = ACCEPTED_COINS[0];

export function isAcceptedCoin(value: number): value is Coin {
  return ACCEPTED_COINS.some((coin) => coin === value);
}

export function totalCoins(coins: readonly Coin[]): number {
  return coins.reduce((total, coin) => total + coin, 0);
}

export function formatMoney(cents: number, locale = 'en'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

export function centsToEuros(cents: number): string {
  const whole = Math.floor(cents / 100);
  const fraction = (cents % 100).toString().padStart(2, '0');
  return `${whole}.${fraction}`;
}

export function parsePriceToCents(input: string): number {
  const value = input.trim().replace(',', '.');
  const parts = value.split('.');
  if (parts.length > 2) {
    return 0;
  }
  const [whole = '', fraction = ''] = parts;
  if (
    !/^\d+$/.test(whole) ||
    (fraction !== '' && (!/^\d+$/.test(fraction) || fraction.length > 2))
  ) {
    return 0;
  }
  const euros = Number(whole);
  const cents = Number((fraction + '00').slice(0, 2));
  return euros * 100 + cents;
}
