import type { Coin, Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  insertedCoins: readonly Coin[];
  onBuy: (productId: string) => void;
}

export function ProductGrid({ products, insertedCoins, onBuy }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <h3>No products available</h3>
        <p>Add a product from the inventory view.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          insertedCoins={insertedCoins}
          onBuy={onBuy}
        />
      ))}
    </div>
  );
}
