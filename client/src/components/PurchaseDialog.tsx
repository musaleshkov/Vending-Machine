import { formatMoney, totalCoins } from '../domain/money';
import type { PurchaseResultNotice } from '../types';

interface PurchaseDialogProps {
  result: PurchaseResultNotice;
  onClose: () => void;
}

export function PurchaseDialog({ result, onClose }: PurchaseDialogProps) {
  const success = result.kind === 'success';
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="result-dialog" role="dialog" aria-modal="true" aria-labelledby="result-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <div className={`result-dialog__icon result-dialog__icon--${success ? 'success' : 'error'}`} aria-hidden="true">{success ? '✓' : '!'}</div>
        <h2 id="result-title">{success ? 'Enjoy your product!' : 'Cannot complete purchase'}</h2>
        <p>{success ? `${result.productName} dispensed with ${result.change.length ? `${formatMoney(totalCoins(result.change))} change` : 'exact payment'}.` : result.message}</p>
        {success && result.change.length > 0 && (
          <div className="change-summary">
            <span>Change returned:</span>
            <strong>{formatMoney(totalCoins(result.change))}</strong>
            <div>{result.change.map((coin, index) => <span className="mini-coin" key={`${coin}-${index}`}>{formatMoney(coin)}</span>)}</div>
          </div>
        )}
        <button className={`button ${success ? 'button--primary' : 'button--danger-solid'} button--full`} type="button" onClick={onClose}>Close</button>
      </section>
    </div>
  );
}
