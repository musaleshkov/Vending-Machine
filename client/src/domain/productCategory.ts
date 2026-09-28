export const PRODUCT_CATEGORIES = ['drinks', 'snacks', 'sweets'] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function inferCategory(product: {
  name: string;
  category?: ProductCategory;
}): ProductCategory {
  if (product.category) return product.category;
  const name = product.name.toLowerCase();
  if (name.includes('water') || name.includes('juice') || name.includes('tea'))
    return 'drinks';
  if (name.includes('chocolate')) return 'sweets';
  return 'snacks';
}
