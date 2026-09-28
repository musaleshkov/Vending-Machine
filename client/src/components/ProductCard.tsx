import { formatMoney, totalCoins } from '../domain/money';
import type { Coin, Product } from '../types';
import { Icon } from './Icon';

interface ProductCardProps {
  product: Product;
  insertedCoins: readonly Coin[];
  onBuy: (productId: string) => void;
}

export function ProductCard({ product, insertedCoins, onBuy }: ProductCardProps) {
  const balance = totalCoins(insertedCoins);
  const missing = Math.max(0, product.priceCents - balance);
  const isOutOfStock = product.quantity === 0;
  const image = product.image ?? productEmoji(product.name);

  return (
    <article className={`product-card${isOutOfStock ? ' product-card--empty' : ''}`}>
      <span className="favorite-button" aria-hidden="true">
        ♡
      </span>
      <div className="product-card__illustration" aria-hidden="true">
        {product.image ? <img src={product.image} alt="" /> : <span>{image}</span>}
      </div>
      <div className="product-card__content">
        <div>
          <h3>{product.name}</h3>
        </div>
        <p className="product-card__price">{formatMoney(product.priceCents)}</p>
        <p className="stock" data-empty={isOutOfStock}>
          {isOutOfStock ? 'Out of stock' : `In stock: ${product.quantity}`}
          {!isOutOfStock && (
            <span className="sr-only">{`${product.quantity} available`}</span>
          )}
        </p>
      </div>
      <button
        className="button button--primary button--full"
        type="button"
        disabled={isOutOfStock || missing > 0}
        onClick={() => onBuy(product.id)}
        aria-label={`Buy ${product.name} for ${formatMoney(product.priceCents)}`}
      >
        <Icon name="cart" size={16} />
        {isOutOfStock
          ? 'Unavailable'
          : missing > 0
            ? `Insert ${formatMoney(missing)} more`
            : 'Buy'}
      </button>
    </article>
  );
}

function productEmoji(name: string) {
  const value = name.toLowerCase();
  if (value.includes('water')) return '💧';
  if (value.includes('juice')) return '🧃';
  if (value.includes('tea')) return '🧋';
  if (value.includes('chocolate')) return '🍫';
  if (value.includes('cracker')) return '🥨';
  if (value.includes('mix')) return '🥜';
  return '🥤';
}
