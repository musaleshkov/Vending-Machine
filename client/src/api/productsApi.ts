import { isProduct } from '../domain/productValidation';
import type { Product } from '../types';
import { fetchJson } from './fetchJson';

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const data = await fetchJson(
    '/api/products',
    'The product list could not be loaded.',
    signal,
  );

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
