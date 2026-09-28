import type { Dispatch } from 'react';
import { useCallback, useEffect } from 'react';

import { fetchProducts } from '../api/productsApi';
import type { VendingAction } from '../state/vendingReducer';

export function useProducts(dispatch: Dispatch<VendingAction>) {
  const loadProducts = useCallback(
    (signal?: AbortSignal) => {
      dispatch({ type: 'productsLoadStarted' });
      fetchProducts(signal)
        .then((products) => dispatch({ type: 'productsLoadSucceeded', products }))
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return;
          }
          dispatch({
            type: 'productsLoadFailed',
            error:
              error instanceof Error
                ? error.message
                : 'The product list could not be loaded.',
          });
        });
    },
    [dispatch],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
  }, [loadProducts]);

  return { loadProducts };
}
