"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/shop";
import { CartLineItem } from "./CartDrawer";
import { useCart } from "./CartProvider";

export function CartPageView() {
  const { lines, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="cart-page__empty">
        <p className="sma-body-text">Your cart is empty.</p>
        <Link href="/collections/all" className="sma-button-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <ul className="cart-page__lines">
        {lines.map((line) => (
          <CartLineItem key={line.variantId} line={line} />
        ))}
      </ul>
      <aside className="cart-page__summary">
        <div className="cart-total">
          <span className="sma-label-text">Subtotal</span>
          <span className="cart-total__amount">{formatPrice(subtotal)}</span>
        </div>
        <p className="sma-chotta-text">Taxes and shipping calculated at checkout.</p>
        <Link href="/checkout" className="button-solid">
          Checkout
        </Link>
        <Link href="/collections/all" className="cart-drawer__view">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
