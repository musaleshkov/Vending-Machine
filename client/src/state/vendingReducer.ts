import { INITIAL_CASHBOX } from '../domain/cashbox';
import { isAcceptedCoin } from '../domain/money';
import { processPurchase } from '../domain/vendingTransaction';
import type { Cashbox, Coin, Notice, Product, PurchaseResultNotice } from '../types';
import {
  coinAdded,
  coinRejected,
  coinsReturned,
  productAdded,
  productDeleted,
  productNotFound,
  productUpdated,
  purchaseFailed,
} from './notifications';

export interface VendingState {
  products: Product[];
  insertedCoins: Coin[];
  returnedCoins: Coin[];
  cashbox: Cashbox;
  loading: boolean;
  loadError: string | null;
  notice: Notice | null;
  purchaseResult: PurchaseResultNotice | null;
}

export type VendingAction =
  | { type: 'productsLoadStarted' }
  | { type: 'productsLoadSucceeded'; products: Product[] }
  | { type: 'productsLoadFailed'; error: string }
  | { type: 'coinInserted'; coin: number }
  | { type: 'purchaseRequested'; productId: string }
  | { type: 'transactionReset' }
  | { type: 'insertedCoinRemoved'; index: number }
  | { type: 'productAdded'; product: Product }
  | { type: 'productUpdated'; product: Product }
  | { type: 'productDeleted'; productId: string }
  | { type: 'messageDismissed' }
  | { type: 'purchaseResultDismissed' };

export const initialVendingState: VendingState = {
  products: [],
  insertedCoins: [],
  returnedCoins: [],
  cashbox: INITIAL_CASHBOX,
  loading: true,
  loadError: null,
  notice: null,
  purchaseResult: null,
};

export function vendingReducer(state: VendingState, action: VendingAction): VendingState {
  switch (action.type) {
    case 'productsLoadStarted':
      return { ...state, loading: true, loadError: null };
    case 'productsLoadSucceeded':
      return { ...state, loading: false, loadError: null, products: action.products };
    case 'productsLoadFailed':
      return { ...state, loading: false, loadError: action.error };
    case 'coinInserted':
      if (!isAcceptedCoin(action.coin)) {
        return { ...state, notice: coinRejected() };
      }
      return {
        ...state,
        insertedCoins: [...state.insertedCoins, action.coin],
        returnedCoins: [],
        notice: coinAdded(action.coin),
      };
    case 'purchaseRequested': {
      const product = state.products.find(({ id }) => id === action.productId);
      if (!product) {
        return {
          ...state,
          notice: productNotFound(),
          purchaseResult: { kind: 'error', message: productNotFound().text },
        };
      }
      const result = processPurchase(product, state.insertedCoins, state.cashbox);
      if (!result.success) {
        return {
          ...state,
          notice: purchaseFailed(result.reason),
          purchaseResult: { kind: 'error', message: purchaseFailed(result.reason).text },
        };
      }
      return {
        ...state,
        products: state.products.map((candidate) =>
          candidate.id === product.id
            ? { ...candidate, quantity: candidate.quantity - 1 }
            : candidate,
        ),
        insertedCoins: [],
        returnedCoins: result.change,
        cashbox: result.cashbox,
        notice: null,
        purchaseResult: {
          kind: 'success',
          productName: product.name,
          change: result.change,
        },
      };
    }
    case 'insertedCoinRemoved':
      return {
        ...state,
        insertedCoins: state.insertedCoins.filter((_, index) => index !== action.index),
        returnedCoins: [],
      };
    case 'transactionReset':
      return {
        ...state,
        returnedCoins: state.insertedCoins,
        insertedCoins: [],
        notice: coinsReturned(state.insertedCoins.length),
      };
    case 'productAdded':
      return {
        ...state,
        products: [...state.products, action.product],
        notice: productAdded(action.product.name),
      };
    case 'productUpdated':
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.product.id ? action.product : product,
        ),
        notice: productUpdated(action.product.name),
      };
    case 'productDeleted': {
      const deleted = state.products.find(({ id }) => id === action.productId);
      return {
        ...state,
        products: state.products.filter(({ id }) => id !== action.productId),
        notice: productDeleted(deleted?.name ?? null),
      };
    }
    case 'messageDismissed':
      return { ...state, notice: null };
    case 'purchaseResultDismissed':
      return { ...state, purchaseResult: null };
    default:
      return assertNever(action);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(value)}`);
}
