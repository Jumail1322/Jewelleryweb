"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/lib/shop";
import { type CartLine, useCart } from "./CartProvider";

export function QuantityControl({ line }: { line: CartLine }) {
  const { setQuantity } = useCart();
  return (
    <div className="qty">
      <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(line.variantId, line.quantity - 1)}>
        −
      </button>
      <span aria-live="polite">{line.quantity}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(line.variantId, line.quantity + 1)}>
        +
      </button>
    </div>
  );
}

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { remove } = useCart();
  return (
    <li className="cart-line">
      <Link href={`/products/${line.handle}`} className="cart-line__image" onClick={onNavigate}>
        {line.image && <Image src={line.image} alt={line.title} fill sizes="96px" />}
      </Link>
      <div className="cart-line__info">
        <Link href={`/products/${line.handle}`} className="cart-line__title" onClick={onNavigate}>
          {line.title}
        </Link>
        {line.variantTitle && <span className="sma-chotta-text">{line.variantTitle}</span>}
        <span className="cart-line__price">{formatPrice(line.price)}</span>
        <div className="cart-line__actions">
          <QuantityControl line={line} />
          <button type="button" className="cart-line__remove" onClick={() => remove(line.variantId)}>
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const { lines, subtotal, isOpen, close } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <div className={`drawer-backdrop${isOpen ? " is-open" : ""}`} onClick={close} aria-hidden="true" />
      <aside className={`cart-drawer${isOpen ? " is-open" : ""}`} aria-label="Cart" aria-hidden={!isOpen} inert={!isOpen}>
        <div className="cart-drawer__header">
          <h2 className="sma-primary-heading">Your cart</h2>
          <button type="button" className="icon-button" aria-label="Close cart" onClick={close}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-drawer__empty">
            <p className="sma-body-text">Your cart is empty.</p>
            <Link href="/collections/all" className="sma-button-primary" onClick={close}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__lines">
              {lines.map((line) => (
                <CartLineItem key={line.variantId} line={line} onNavigate={close} />
              ))}
            </ul>
            <div className="cart-drawer__footer">
              <div className="cart-total">
                <span className="sma-label-text">Subtotal</span>
                <span className="cart-total__amount">{formatPrice(subtotal)}</span>
              </div>
              <p className="sma-chotta-text">Taxes and shipping calculated at checkout.</p>
              <Link href="/checkout" className="button-solid" onClick={close}>
                Checkout
              </Link>
              <Link href="/cart" className="cart-drawer__view" onClick={close}>
                View cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
