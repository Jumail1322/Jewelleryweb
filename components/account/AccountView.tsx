"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginForm } from "@/components/auth/LoginForm";
import { getOrders, type Order } from "@/lib/checkout";
import { formatPrice } from "@/lib/shop";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const label = (s?: string | null) => (s ? s.replace(/_/g, " ").toLowerCase() : "");

function OrderCard({ order }: { order: Order }) {
  return (
    <li className="order-card">
      <div className="order-card__header">
        <div>
          <span className="sma-label-text">Order #{order.order_id}</span>
          <span className="sma-chotta-text">{dateFormat.format(new Date(order.created_at))}</span>
        </div>
        <div className="order-card__meta">
          {order.payment_status && <span className="status-pill">{label(order.payment_status)}</span>}
          <span className="cart-total__amount">{formatPrice(Number(order.total_price))}</span>
        </div>
      </div>
      <ul className="order-card__items">
        {order.items.map((item) => {
          const v = item.product_variant;
          return (
            <li key={item.id}>
              <span className="checkout__thumb">
                {v?.images?.[0]?.image && <Image src={v.images[0].image} alt="" fill sizes="56px" />}
              </span>
              <span className="checkout__line-title">
                {v?.product?.slug ? <Link href={`/products/${v.product.slug}`}>{v.product.name}</Link> : (v?.product?.name ?? v?.sku)}
                <small>
                  Qty {item.quantity}
                  {item.status ? ` · ${label(item.status)}` : ""}
                </small>
              </span>
              <span>{formatPrice(Number(item.price) * item.quantity)}</span>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function AccountView() {
  const { session, ready, logout, authFetch } = useAuth();
  const placed = useSearchParams().get("placed");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    getOrders(authFetch)
      .then((list) => !cancelled && setOrders(list))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [session, authFetch]);

  if (!ready) return null;

  if (!session) {
    return (
      <div className="account-login">
        <p className="sma-body-text">Log in with your email — we’ll send you a one-time code.</p>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="account">
      {placed && (
        <p className="account__notice" role="status">
          Thank you! Your order #{placed} has been placed.
        </p>
      )}
      <div className="account__bar">
        <p className="sma-body-text">
          Logged in as <strong>{session.email}</strong>
        </p>
        <button type="button" className="link-button" onClick={logout}>
          Log out
        </button>
      </div>

      <h2 className="checkout__heading">Your orders</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!orders && !error && <p className="sma-chotta-text">Loading orders…</p>}
      {orders?.length === 0 && (
        <div className="cart-page__empty">
          <p className="sma-body-text">You haven’t placed any orders yet.</p>
          <Link href="/collections/all" className="sma-button-primary">
            Start shopping
          </Link>
        </div>
      )}
      {orders && orders.length > 0 && (
        <ul className="order-list">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </ul>
      )}
    </div>
  );
}
