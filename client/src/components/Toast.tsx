import type { Notice } from '../types';

interface ToastProps {
  notice: Notice;
  onDismiss: () => void;
}

export function Toast({ notice, onDismiss }: ToastProps) {
  const isError = notice.kind === 'error';

  return (
    <div
      className={`toast toast--${notice.kind}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <span>{notice.text}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss message">
        ×
      </button>
    </div>
  );
}
