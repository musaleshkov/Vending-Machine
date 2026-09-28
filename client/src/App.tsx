import { useMemo, useReducer, useState } from 'react';

import { CoinPanel } from './components/CoinPanel';
import { Modal } from './components/Modal';
import { ProductGrid } from './components/ProductGrid';
import { ProductManager } from './components/ProductManager';
import { PurchaseDialog } from './components/PurchaseDialog';
import { SiteHeader } from './components/SiteHeader';
import { Toast } from './components/Toast';
import { Topbar } from './components/Topbar';
import { inferCategory } from './domain/productCategory';
import { createProductId } from './domain/productId';
import { useProducts } from './hooks/useProducts';
import { initialVendingState, vendingReducer } from './state/vendingReducer';
import {
  type Coin,
  PRODUCT_CATEGORIES,
  type ProductCategory,
  type ProductDraft,
} from './types';

export default function App() {
  const [state, dispatch] = useReducer(vendingReducer, initialVendingState);
  const [managerOpen, setManagerOpen] = useState(false);
  const [category, setCategory] = useState<'all' | ProductCategory>('all');
  const [query, setQuery] = useState('');
  const { loadProducts } = useProducts(dispatch);
  const visibleProducts = useMemo(
    () =>
      state.products.filter(
        (product) =>
          (category === 'all' || inferCategory(product) === category) &&
          product.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [category, query, state.products],
  );

  function addProduct(draft: ProductDraft) {
    dispatch({
      type: 'productAdded',
      product: { ...draft, id: createProductId(draft.name, state.products) },
    });
    setManagerOpen(false);
  }

  return (
    <div className="app-shell">
      <SiteHeader onManage={() => setManagerOpen(true)} />
      <div className="workspace">
        <Topbar query={query} onQueryChange={setQuery} />

        <main id="main-content">
          {state.notice && (
            <Toast
              notice={state.notice}
              onDismiss={() => dispatch({ type: 'messageDismissed' })}
            />
          )}

          <section className="machine-layout" aria-labelledby="products-title">
            <div className="products-section">
              <div className="products-toolbar">
                <div>
                  <h2 id="products-title">Products</h2>
                  <p>Choose your favorite item</p>
                </div>
                <div className="filter-chips" aria-label="Product categories">
                  {(['all', ...PRODUCT_CATEGORIES] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={category === item ? 'is-active' : ''}
                      onClick={() => setCategory(item)}
                    >
                      <span aria-hidden="true">
                        {item === 'all'
                          ? '✦'
                          : item === 'drinks'
                            ? '♙'
                            : item === 'snacks'
                              ? '◇'
                              : '❖'}
                      </span>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {state.loading && <div className="loading-state">Loading products…</div>}
              {state.loadError && (
                <div className="error-state" role="alert">
                  <div>
                    <h3>Products are temporarily unavailable</h3>
                    <p>{state.loadError}</p>
                  </div>
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() => loadProducts()}
                  >
                    Try again
                  </button>
                </div>
              )}
              {!state.loading && !state.loadError && (
                <ProductGrid
                  products={visibleProducts}
                  insertedCoins={state.insertedCoins}
                  onBuy={(productId) =>
                    dispatch({ type: 'purchaseRequested', productId })
                  }
                />
              )}
            </div>

            <CoinPanel
              insertedCoins={state.insertedCoins}
              returnedCoins={state.returnedCoins}
              onInsert={(coin: Coin) => dispatch({ type: 'coinInserted', coin })}
              onReset={() => dispatch({ type: 'transactionReset' })}
              onRemove={(index) => dispatch({ type: 'insertedCoinRemoved', index })}
            />
          </section>

          {managerOpen && (
            <Modal
              labelledBy="manager-title"
              onClose={() => setManagerOpen(false)}
              backdropClassName="manager-backdrop"
              dialogClassName="manager-dialog"
            >
              <button
                className="modal-close"
                type="button"
                onClick={() => setManagerOpen(false)}
                aria-label="Close inventory management"
              >
                ×
              </button>
              <ProductManager
                products={state.products}
                cashbox={state.cashbox}
                onAdd={addProduct}
                onUpdate={(product) => dispatch({ type: 'productUpdated', product })}
                onDelete={(productId) => dispatch({ type: 'productDeleted', productId })}
              />
            </Modal>
          )}

          {state.purchaseResult && (
            <PurchaseDialog
              result={state.purchaseResult}
              onClose={() => dispatch({ type: 'purchaseResultDismissed' })}
            />
          )}
        </main>
        <footer>
          <span>EUR · Accepted coins: 10c, 20c, 50c, €1, €2</span>
          <span>Inventory changes remain in this browser session.</span>
        </footer>
      </div>
    </div>
  );
}
