import type { Cashbox, Coin, Product } from '../types';
import { addCoins, removeCoins } from './cashbox';
import { calculateChange } from './changeCalculator';
import { totalCoins } from './money';

export type PurchaseResult =
  | { success: true; change: Coin[]; cashbox: Cashbox }
  | { success: false; reason: string };

export function processPurchase(
  product: Product,
  insertedCoins: readonly Coin[],
  cashbox: Readonly<Cashbox>,
): PurchaseResult {
  if (product.quantity <= 0) {
    return { success: false, reason: `${product.name} is out of stock.` };
  }

  const balance = totalCoins(insertedCoins);
  if (balance < product.priceCents) {
    return { success: false, reason: 'Insert more money to buy this product.' };
  }

  const cashboxWithPayment = addCoins(cashbox, insertedCoins);
  const change = calculateChange(balance - product.priceCents, cashboxWithPayment);
  if (change === null) {
    return { success: false, reason: 'The machine cannot return exact change.' };
  }

  const updatedCashbox = removeCoins(cashboxWithPayment, change);
  if (!updatedCashbox) {
    return { success: false, reason: 'The machine cannot return exact change.' };
  }

  return { success: true, change, cashbox: updatedCashbox };
}
