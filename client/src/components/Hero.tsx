import { formatMoney, totalCoins } from '../domain/money';
import type { Coin } from '../types';

interface HeroProps {
  insertedCoins: readonly Coin[];
}

export function Hero({ insertedCoins }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div>
        <p className="eyebrow">Fresh choices · Instant checkout</p>
        <h1 id="hero-title">
          Pick a favorite.
          <br />
          We’ll handle the change.
        </h1>
        <p className="hero__copy">
          Insert an accepted coin, choose a product, and collect any remaining balance
          from the change tray.
        </p>
      </div>
      <div className="hero__balance" aria-label="Current inserted balance">
        <span>Ready balance</span>
        <strong>{formatMoney(totalCoins(insertedCoins))}</strong>
      </div>
    </section>
  );
}
