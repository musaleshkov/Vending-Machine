export const ACCEPTED_COINS = [10, 20, 50, 100, 200] as const;

export type Coin = (typeof ACCEPTED_COINS)[number];

export type Cashbox = Record<Coin, number>;

export interface Product {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  category?: ProductCategory;
  image?: string;
}

export type ProductCategory = 'drinks' | 'snacks' | 'sweets';

export type ProductDraft = Omit<Product, 'id'>;

export type View = 'machine' | 'inventory';

export type MessageKind = 'success' | 'error' | 'info';

export interface Notice {
  kind: MessageKind;
  text: string;
}

export type PurchaseResultNotice =
  | { kind: 'success'; productName: string; change: Coin[] }
  | { kind: 'error'; message: string };
