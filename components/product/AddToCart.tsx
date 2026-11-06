"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, isHexColor, type Product, type Variant } from "@/lib/shop";

function Swatch({ value }: { value: string }) {
  return isHexColor(value) ? <span className="pdp-swatch__color" style={{ background: value }} aria-label={value} /> : <>{value}</>;
}

function VariantLabel({ variant }: { variant: Variant }) {
  const parts = Object.entries(variant.attributes).filter(([name]) => name !== "Title");
  if (parts.length === 0) return <>{variant.sku}</>;
  return (
    <span className="pdp-variant-label">
      {parts.map(([name, value]) =>
        isHexColor(value) ? (
          <span key={name} className="pdp-swatch__color pdp-swatch__color--small" style={{ background: value }} title={`${name} ${value}`} />
        ) : (
          <span key={name}>{value}</span>
        ),
      )}
    </span>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const initial = product.variants.find((v) => v.available) ?? product.variants[0];
  const [variant, setVariant] = useState<Variant | undefined>(initial);
  const [quantity, setQuantity] = useState(1);
  if (!variant) return <p className="sma-body-text">This piece is not available right now.</p>;

  // Pick the variant matching the chosen value for one option, keeping the others where possible
  const choose = (name: string, value: string) => {
    const wanted = { ...variant.attributes, [name]: value };
    const matches = product.variants.filter((v) => v.attributes[name] === value);
    const best =
      matches.find((v) => product.options.every((o) => v.attributes[o.name] === wanted[o.name])) ??
      matches.find((v) => v.available) ??
      matches[0];
    if (best) setVariant(best);
    setQuantity(1);
  };

  // Variants that don't share a common set of options get a single picker instead
  const freeform = product.options.length === 0 && product.variants.length > 1;
  const maxQty = Math.max(1, variant.stock);

  return (
    <div className="pdp-buy">
      <div className="pdp-price">
        {variant.compareAtPrice && <s className="pdp-price__compare">{formatPrice(variant.compareAtPrice)}</s>}
        <span>{formatPrice(variant.price)}</span>
      </div>
      <p className="sma-chotta-text pdp-tax">
        {variant.available ? (variant.stock <= 5 ? `Only ${variant.stock} left` : "In stock") : "Out of stock"}
        {product.nextDayShipping && variant.available ? " · Next-day shipping available" : ""}
      </p>

      {product.options.map((option) => (
        <fieldset key={option.name} className="pdp-option">
          <legend className="form__label">
            {option.name}
            {isHexColor(variant.attributes[option.name] ?? "") ? "" : `: ${variant.attributes[option.name] ?? ""}`}
          </legend>
          <div className="pdp-option__values">
            {option.values.map((value) => {
              const active = variant.attributes[option.name] === value;
              const inStock = product.variants.some((v) => v.attributes[option.name] === value && v.available);
              return (
                <button
                  key={value}
                  type="button"
                  className={`pdp-swatch${active ? " is-active" : ""}${inStock ? "" : " is-unavailable"}${isHexColor(value) ? " pdp-swatch--color" : ""}`}
                  aria-pressed={active}
                  title={value}
                  onClick={() => choose(option.name, value)}
                >
                  <Swatch value={value} />
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {freeform && (
        <fieldset className="pdp-option">
          <legend className="form__label">Variant</legend>
          <div className="pdp-option__values">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`pdp-swatch${v.id === variant.id ? " is-active" : ""}${v.available ? "" : " is-unavailable"}`}
                aria-pressed={v.id === variant.id}
                onClick={() => {
                  setVariant(v);
                  setQuantity(1);
                }}
              >
                <VariantLabel variant={v} />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="pdp-quantity">
        <span className="form__label">Quantity</span>
        <div className="qty">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span>{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}>
            +
          </button>
        </div>
      </div>

      <div className="pdp-actions">
        <button
          type="button"
          className="button-solid"
          disabled={!variant.available}
          onClick={() =>
            add(
              {
                variantId: variant.id,
                handle: product.handle,
                title: product.title,
                variantTitle: variant.title || null,
                price: variant.price,
                image: variant.image ?? product.images[0]?.src ?? null,
              },
              quantity,
            )
          }
        >
          {variant.available ? "Add to cart" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
