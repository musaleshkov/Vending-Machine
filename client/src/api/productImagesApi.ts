import { fetchJson } from './fetchJson';

export interface ProductImageOption {
  id: string;
  label: string;
  url: string;
}

export async function fetchProductImages(
  signal?: AbortSignal,
): Promise<ProductImageOption[]> {
  const data = await fetchJson(
    '/api/product-images',
    'The product image catalog could not be loaded.',
    signal,
  );

  if (!Array.isArray(data) || !data.every(isProductImageOption)) {
    throw new Error('The product image catalog returned an invalid response.');
  }
  return data;
}

function isProductImageOption(value: unknown): value is ProductImageOption {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.label === 'string' &&
    typeof candidate.url === 'string'
  );
}
