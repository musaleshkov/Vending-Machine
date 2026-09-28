import { useState } from 'react';

import { cashboxTotal } from '../domain/cashbox';
import { formatMoney } from '../domain/money';
import { MAX_QUANTITY } from '../domain/productValidation';
import { ACCEPTED_COINS, type Cashbox, type Product, type ProductDraft } from '../types';
import { ProductForm } from './ProductForm';

interface ProductManagerProps {
  products: Product[];
  cashbox: Cashbox;
  onAdd: (draft: ProductDraft) => void;
  onUpdate: (product: Product) => void;
  onDelete: (productId: string) => void;
  onConfirmDelete?: (message: string) => boolean;
}

export function ProductManager({
  products,
  cashbox,
  onAdd,
  onUpdate,
  onDelete,
  onConfirmDelete,
}: ProductManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingProduct = products.find(({ id }) => id === editingId);

  function handleSave(draft: ProductDraft, id?: string) {
    if (id) {
      onUpdate({ ...draft, id });
      setEditingId(null);
    } else {
      onAdd(draft);
    }
  }

  function handleDelete(product: Product) {
    const confirm = onConfirmDelete ?? ((message: string) => window.confirm(message));
    if (confirm(`Delete ${product.name}? This local change lasts until reload.`)) {
      onDelete(product.id);
      if (editingId === product.id) {
        setEditingId(null);
      }
    }
  }

  return (
    <section className="manager" aria-labelledby="manager-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Local application state</p>
          <h2 id="manager-title">Manage inventory</h2>
        </div>
        <p>Changes made here are intentionally reset when the page reloads.</p>
      </div>

      <div className="manager__form-card">
        <h3>{editingProduct ? `Edit ${editingProduct.name}` : 'Add a product'}</h3>
        <ProductForm
          key={editingProduct?.id ?? 'new-product'}
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      </div>

      <section className="cashbox-summary" aria-labelledby="cashbox-title">
        <div>
          <p className="eyebrow">Machine funds</p>
          <h3 id="cashbox-title">Change reserve</h3>
          <p>{formatMoney(cashboxTotal(cashbox))} available for future transactions</p>
        </div>
        <dl>
          {ACCEPTED_COINS.map((coin) => (
            <div key={coin}>
              <dt>{formatMoney(coin)}</dt>
              <dd>{cashbox[coin]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="inventory-list" aria-label="Current products">
        {products.map((product) => (
          <article className="inventory-row" key={product.id}>
            <div className="inventory-row__identity">
              {product.image ? (
                <img className="inventory-row__image" src={product.image} alt="" />
              ) : (
                <span className="inventory-row__mark" aria-hidden="true">
                  {product.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div>
                <h3>{product.name}</h3>
                <p>{product.id}</p>
              </div>
            </div>
            <dl className="inventory-row__stats">
              <div>
                <dt>Price</dt>
                <dd>{formatMoney(product.priceCents)}</dd>
              </div>
              <div>
                <dt>Stock</dt>
                <dd>
                  {product.quantity} / {MAX_QUANTITY}
                </dd>
              </div>
            </dl>
            <div className="inventory-row__actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={() => setEditingId(product.id)}
              >
                Edit
              </button>
              <button
                className="button button--danger"
                type="button"
                onClick={() => handleDelete(product)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
