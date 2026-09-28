import { formatMoney, totalCoins } from '../domain/money';
import { ACCEPTED_COINS, type Coin } from '../types';

interface CoinPanelProps {
  insertedCoins: readonly Coin[];
  returnedCoins: readonly Coin[];
  onInsert: (coin: Coin) => void;
  onReset: () => void;
  onRemove?: (index: number) => void;
}

export function CoinPanel({
  insertedCoins,
  returnedCoins,
  onInsert,
  onReset,
  onRemove,
}: CoinPanelProps) {
  const balance = totalCoins(insertedCoins);
  const returnedTotal = totalCoins(returnedCoins);

  return (
    <aside className="payment-panel" aria-labelledby="payment-title">
      <div className="balance-block">
        <p className="eyebrow" id="payment-title">
          Current balance
        </p>
        <p className="balance-value">{formatMoney(balance)}</p>
        <p className="balance-detail">
          {insertedCoins.length
            ? `${insertedCoins.length} coin${insertedCoins.length === 1 ? '' : 's'} inserted`
            : 'Insert a coin to begin'}
        </p>
      </div>

      <div className="coin-controls">
        <h3>Insert coin</h3>
        <div className="coin-grid" aria-label="Accepted coins">
          {ACCEPTED_COINS.map((coin) => (
            <button
              className="coin"
              type="button"
              key={coin}
              onClick={() => onInsert(coin)}
              aria-label={`Insert ${formatMoney(coin)}`}
            >
              <span className="coin__face" aria-hidden="true">€</span>
              <span className="coin__label">{coin < 100 ? `${coin}c` : `€${coin / 100}`}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="button button--outline button--full"
        type="button"
        onClick={onReset}
      >
        <span aria-hidden="true">↶</span> Return coins
      </button>

      <p className="coin-note">ⓘ Only the accepted coin denominations can be used.</p>

      <section className="inserted-coins" aria-labelledby="inserted-title">
        <div className="inserted-coins__heading">
          <h3 id="inserted-title">Inserted coins</h3>
          <span>{insertedCoins.length} coins · {formatMoney(balance)}</span>
        </div>
        {insertedCoins.length > 0 && (
          <div className="coin-ledger">
            {insertedCoins.map((coin, index) => (
              <div className="coin-ledger__row" key={`${coin}-${index}`}>
                <span className="coin-ledger__icon" aria-hidden="true">●</span>
                <strong aria-label={formatMoney(coin)}><span>{formatMoney(coin).slice(0, 1)}</span><span>{formatMoney(coin).slice(1)}</span></strong>
                <span>Just now</span>
                {onRemove && (
                  <button type="button" onClick={() => onRemove(index)} aria-label={`Remove ${formatMoney(coin)} coin`}>−</button>
                )}
              </div>
            ))}
            <div className="coin-ledger__total"><span>Total</span><strong aria-label={formatMoney(balance)}><span>{formatMoney(balance).slice(0, 1)}</span><span>{formatMoney(balance).slice(1)}</span></strong></div>
          </div>
        )}
      </section>

      {returnedCoins.length > 0 && (
        <div className="sr-only" aria-live="polite">
          <p className="eyebrow">Change tray</p>
          <p className="change-tray__total">{formatMoney(returnedTotal)}</p>
          <p>{returnedCoins.map((coin) => formatMoney(coin)).join(' · ')}</p>
        </div>
      )}
    </aside>
  );
}
