import { ACCEPTED_COINS, type Cashbox, type Coin } from './domain/coins';
import { PRODUCT_CATEGORIES, type ProductCategory } from './domain/productCategory';

export {
  ACCEPTED_COINS,
  type Cashbox,
  type Coin,
  PRODUCT_CATEGORIES,
  type ProductCategory,
};

export interface Product {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  category?: ProductCategory;
  image?: string;
}

export type ProductDraft = Omit<Product, 'id'>;

export type MessageKind = 'success' | 'error' | 'info';

export interface Notice {
  kind: MessageKind;
  text: string;
}

export type PurchaseResultNotice =
  | { kind: 'success'; productName: string; change: Coin[] }
  | { kind: 'error'; message: string };
