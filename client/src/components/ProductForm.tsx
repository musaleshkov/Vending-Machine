import { type FormEvent, useState } from 'react';

import { centsToEuros, parsePriceToCents } from '../domain/money';
import {
  MAX_QUANTITY,
  validateProduct,
  type ValidationResult,
} from '../domain/productValidation';
import type { Product, ProductDraft } from '../types';

interface ProductFormProps {
  product?: Product;
  onSave: (draft: ProductDraft, id?: string) => void;
  onCancel?: () => void;
}

const EMPTY_DRAFT: ProductDraft = { name: '', priceCents: 100, quantity: 1 };

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(
    product
      ? { name: product.name, priceCents: product.priceCents, quantity: product.quantity }
      : EMPTY_DRAFT,
  );
  const [errors, setErrors] = useState<ValidationResult['errors']>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateProduct(draft);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    onSave({ ...draft, name: draft.name.trim() }, product?.id);
    if (!product) {
      setDraft(EMPTY_DRAFT);
    }
    setErrors({});
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="field field--wide">
        <label htmlFor="product-name">Product name</label>
        <input
          id="product-name"
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'product-name-error' : undefined}
          autoComplete="off"
        />
        {errors.name && (
          <span className="field-error" id="product-name-error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="product-price">Price in EUR</label>
        <input
          id="product-price"
          type="number"
          min="0.10"
          step="0.10"
          value={centsToEuros(draft.priceCents)}
          onChange={(event) =>
            setDraft({ ...draft, priceCents: parsePriceToCents(event.target.value) })
          }
          aria-invalid={Boolean(errors.priceCents)}
          aria-describedby={errors.priceCents ? 'product-price-error' : undefined}
        />
        {errors.priceCents && (
          <span className="field-error" id="product-price-error">
            {errors.priceCents}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="product-quantity">Quantity</label>
        <input
          id="product-quantity"
          type="number"
          min="0"
          max={MAX_QUANTITY}
          step="1"
          value={draft.quantity}
          onChange={(event) =>
            setDraft({ ...draft, quantity: Number(event.target.value) })
          }
          aria-invalid={Boolean(errors.quantity)}
          aria-describedby={errors.quantity ? 'product-quantity-error' : undefined}
        />
        {errors.quantity && (
          <span className="field-error" id="product-quantity-error">
            {errors.quantity}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button className="button button--primary" type="submit">
          {product ? 'Save changes' : 'Add product'}
        </button>
        {product && onCancel && (
          <button className="button button--ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
