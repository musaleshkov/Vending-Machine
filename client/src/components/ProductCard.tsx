import { formatMoney, totalCoins } from '../domain/money';
import type { Coin, Product } from '../types';

interface ProductCardProps {
  product: Product;
  insertedCoins: readonly Coin[];
  onBuy: (productId: string) => void;
}

export function ProductCard({ product, insertedCoins, onBuy }: ProductCardProps) {
  const balance = totalCoins(insertedCoins);
  const missing = Math.max(0, product.priceCents - balance);
  const isOutOfStock = product.quantity === 0;
  const visual = productVisual(product.name);

  return (
    <article className={`product-card${isOutOfStock ? ' product-card--empty' : ''}`}>
      <div className="product-card__illustration" aria-hidden="true">
        <div className={`product-pack product-pack--${visual.kind}`}>
          <span className="product-pack__cap" />
          <span className="product-pack__shine" />
          <span className="product-pack__label">{visual.label}</span>
        </div>
      </div>
      <div className="product-card__content">
        <div>
          <h3>{product.name}</h3>
        </div>
        <p className="product-card__price">{formatMoney(product.priceCents)}</p>
        <p className="stock" data-empty={isOutOfStock}>
          {isOutOfStock ? 'Out of stock' : `In stock: ${product.quantity}`}
          {!isOutOfStock && <span className="sr-only">{`${product.quantity} available`}</span>}
        </p>
      </div>
      <button
        className="button button--primary button--full"
        type="button"
        disabled={isOutOfStock}
        onClick={() => onBuy(product.id)}
        aria-label={`Buy ${product.name} for ${formatMoney(product.priceCents)}`}
      >
        <span aria-hidden="true">🛒</span>{' '}
        {isOutOfStock ? 'Unavailable' : missing > 0 ? 'Buy' : 'Buy'}
      </button>
    </article>
  );
}

function productVisual(name: string) {
  const value = name.toLowerCase();
  if (value.includes('water')) return { kind: 'water', label: 'PURE' };
  if (value.includes('juice')) return { kind: 'juice', label: '100%' };
  if (value.includes('tea')) return { kind: 'tea', label: 'TEA' };
  if (value.includes('chocolate')) return { kind: 'chocolate', label: 'CHOCO' };
  if (value.includes('cracker')) return { kind: 'crackers', label: 'CRISP' };
  if (value.includes('mix')) return { kind: 'mix', label: 'MIX' };
  return { kind: 'default', label: name.slice(0, 5).toUpperCase() };
}
