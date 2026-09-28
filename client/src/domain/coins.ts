export const ACCEPTED_COINS = [10, 20, 50, 100, 200] as const;

export type Coin = (typeof ACCEPTED_COINS)[number];

export type Cashbox = Record<Coin, number>;
