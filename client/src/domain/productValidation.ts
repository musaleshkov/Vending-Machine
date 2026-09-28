import type { Product, ProductDraft } from '../types';
import { MINIMUM_COIN } from './money';

export const MAX_QUANTITY = 15;

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ProductDraft, string>>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isValidPriceCents(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0 &&
    value % MINIMUM_COIN === 0
  );
}

export function isValidQuantity(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_QUANTITY
  );
}

export function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    Boolean(value.id.trim()) &&
    typeof value.name === 'string' &&
    Boolean(value.name.trim()) &&
    isValidPriceCents(value.priceCents) &&
    isValidQuantity(value.quantity)
  );
}

export function validateProduct(value: ProductDraft): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  if (typeof value.name !== 'string' || !value.name.trim()) {
    errors.name = 'Enter a product name.';
  }

  if (!isValidPriceCents(value.priceCents)) {
    errors.priceCents = 'Use a positive price in 10-cent increments.';
  }

  if (!isValidQuantity(value.quantity)) {
    errors.quantity = `Quantity must be a whole number from 0 to ${MAX_QUANTITY}.`;
  }

  return { valid: !Object.keys(errors).length, errors };
}
