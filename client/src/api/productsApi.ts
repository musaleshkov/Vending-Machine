import { isProduct } from '../domain/productValidation';
import type { Product } from '../types';

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch('/api/products', { signal });

  if (!response.ok) {
    throw new Error('The product list could not be loaded.');
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('The product service returned an invalid response.');
  }

  return data.map((candidate) => {
    if (!isProduct(candidate)) {
      throw new Error('The product service returned invalid product data.');
    }
    return candidate;
  });
}
