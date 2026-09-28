import type { Product } from '../types';

export function createProductId(name: string, products: Product[]): string {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'product';
  let id = base;
  let suffix = 2;
  while (products.some((product) => product.id === id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}
